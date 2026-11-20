# Deploying PocketPhone

Frontend on Vercel, backend on Render, database on MongoDB Atlas.

Order matters: database, then backend, then frontend, then connect the two.

## 0. Before you start

- The code is pushed to GitHub (`main` branch).
- Free accounts on MongoDB Atlas, Render and Vercel (sign in with GitHub).
- Local MongoDB cannot be used in production. Atlas replaces it.

## 1. Database: MongoDB Atlas

1. Create a free **M0** cluster.
2. **Database Access** -> Add Database User. Choose a username and password and give it the **Read and write to any database** role.
   - Prefer a password with only letters and numbers. If it has symbols such as `@`, `#` or `/`, URL-encode them in the connection string (`@` becomes `%40`).
3. **Network Access** -> Add IP Address -> **Allow access from anywhere** (`0.0.0.0/0`). Render's free plan has no fixed IP.
4. **Database** -> Connect -> Drivers -> copy the connection string and add the database name before the `?`:

   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/newphone?retryWrites=true&w=majority
   ```

   Keep this string. It is your `MONGO_URI`.

## 2. Backend: Render

1. Render dashboard -> **New** -> **Web Service** -> connect the GitHub repo.
2. Settings:

   | Field | Value |
   |---|---|
   | Root Directory | `backend` |
   | Runtime | Node |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Health Check Path | `/` |
   | Instance type | Free |

3. **Environment** -> add:

   | Key | Value |
   |---|---|
   | `MONGO_URI` | the Atlas string from step 1 |
   | `JWT_SECRET` | a long random string, e.g. output of `openssl rand -hex 32` |
   | `STRIPE_SECRET_KEY` | your `sk_test_...` key |
   | `CLIENT_URL` | leave empty for now, fill in step 4 |

   Do not set `PORT`. Render sets it.

4. Create the service. When it is live, open `https://YOUR-BACKEND.onrender.com/`. You should see `{"success":true,"message":"PocketPhone Backend is running!"}`.
5. Also check `https://YOUR-BACKEND.onrender.com/api/phones`. An empty list is fine until you seed (step 5).

## 3. Frontend: Vercel

1. Vercel dashboard -> **Add New** -> **Project** -> import the same repo.
2. Settings:

   | Field | Value |
   |---|---|
   | Framework Preset | Vite |
   | Root Directory | `./` (the repo root, not `backend`) |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

3. **Environment Variables**:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://YOUR-BACKEND.onrender.com/api` |
   | `VITE_STRIPE_PUBLISHABLE_KEY` | your `pk_test_...` key |

   `VITE_API_URL` must end in `/api` and must be set before the build. Changing it later needs a redeploy.

4. Deploy. `vercel.json` is already in the repo, so refreshing on a page like `/phones` works.

## 4. Connect them (CORS)

The backend only accepts requests from the origin(s) listed in `CLIENT_URL`.

1. Render -> your service -> **Environment** -> set `CLIENT_URL` to the Vercel URL, with no trailing slash and no path:

   ```
   https://your-app.vercel.app
   ```

   For several origins (for example a custom domain), separate them with commas.
2. Save. Render redeploys automatically.

## 5. Put phones in the production database

The Atlas database starts empty. Run the seed scripts from your own computer, pointed at Atlas:

```bash
cd backend
MONGO_URI="mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/newphone?retryWrites=true&w=majority" node src/seedDummyPhones.js
```

Optional, adds the older sample phones too: `... node src/seedPhones.js`.

Both scripts are safe to run again. `seedDummyPhones.js` does not delete anything.

## 6. Check that it works

1. Open the Vercel URL. The landing page should list phones.
2. Sign up, log in, open a phone, add it to the cart.
3. Place a Cash on Delivery order and open **Your Orders**.
4. Open **Sell Your Phone** and create a listing.
5. In the browser DevTools Network tab, requests should go to `onrender.com`, not `localhost`.

If something fails:

| Symptom | Cause |
|---|---|
| Blank list, console shows a CORS error | `CLIENT_URL` is wrong or has a trailing slash or a path |
| Requests go to `localhost:5001` | `VITE_API_URL` was not set before the build. Set it and redeploy |
| Render logs show `MongoDB connection error` | Wrong password, special characters not URL-encoded, or `0.0.0.0/0` not allowed in Atlas |
| 404 on refresh of `/phones` | `vercel.json` missing from the repo root |
| First request takes about a minute | Render's free plan sleeps after 15 minutes idle |

## 7. Known limits of this setup

- **Uploaded photos do not persist on Render's free plan.** Its disk is wiped on every restart and redeploy, so photos uploaded through the sell form will break. Fix with a paid Render **persistent disk** mounted at `/opt/render/project/src/backend/uploads`, or move uploads to a service such as Cloudinary or S3. The catalogue phones use CDN photos and are not affected.
- **Card payments need real Stripe test keys.** The keys in the repo history and the `.env` were placeholders.
- **Orders live in the browser** (`localStorage`), not in the database.
- **Changing `JWT_SECRET` logs everyone out.**
- Never commit `.env` files. They are in `.gitignore`. Use `.env.example` and `backend/.env.example` as templates.
