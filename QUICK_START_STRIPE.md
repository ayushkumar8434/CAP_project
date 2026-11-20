# 🚀 Quick Start - Stripe Payment Testing

## Complete This in 5 Minutes

### Step 1: Get Stripe Test API Keys (2 minutes)

1. **Sign up for free**: https://dashboard.stripe.com/register
   - Use any email (e.g., your project email)
   - No credit card required for test mode
   
2. **Get your test keys**: https://dashboard.stripe.com/test/apikeys
   - Copy **Publishable key** (starts with `pk_test_`)
   - Copy **Secret key** (starts with `sk_test_`)
   - Keep this tab open

### Step 2: Update Backend Keys (1 minute)

Open `backend/.env` and replace the placeholder keys:

```env
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
```

**Save the file.**

### Step 3: Update Frontend Key (1 minute)

Open `src/components/StripeWrapper.jsx` and find line 4:

```javascript
const stripePromise = loadStripe('pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE');
```

Replace `pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE` with your real publishable key.

**Save the file.**

### Step 4: Restart Backend (30 seconds)

```bash
# In terminal, run:
cd backend
pkill -f "node src/server.js"
node src/server.js
```

You should see:
```
MongoDB connected successfully
Server running on port 5001
```

### Step 5: Test Payment in Browser (1 minute)

1. **Open**: http://localhost:5173
2. **Login/Signup** (top right)
3. **Browse phones**: Click "Shop Now"
4. **Select a phone**: Click any phone
5. **Add to cart**: Click "Buy Now"
6. **Fill checkout form**:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Address: 123 Test Street
   - City: Mumbai
   - State: Maharashtra
   - PIN: 400001

7. **Enter test card**:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`

8. **Click "Pay ₹XX,XXX"**

9. **Expected**: Redirects to order confirmation page ✅

### Success Indicators

✅ **Payment processing spinner** appears  
✅ **Redirects to /order-confirmation**  
✅ **Shows payment ID** starting with `pi_`  
✅ **Cart is cleared** (navbar badge shows 0)  

### If It Doesn't Work

**Check browser console (F12):**
- Look for red errors
- Common issue: "Invalid API Key" → double-check keys

**Check backend terminal:**
- Should show: `POST /api/payment/create-payment-intent 200`
- If 401: User not logged in
- If 400: Check Stripe keys

**Verify keys are correct:**
- Secret key in `backend/.env` starts with `sk_test_`
- Publishable key in `StripeWrapper.jsx` starts with `pk_test_`
- No extra spaces or quotes

## Test Different Scenarios

### Declined Card
- Card: `4000 0000 0000 0002`
- Result: "Your card was declined" error message

### Requires Authentication (3D Secure)
- Card: `4000 0025 0000 3155`
- Result: Opens authentication popup

### Incomplete Card
- Enter only `4242`
- Result: Pay button stays disabled

## View Payment in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/payments
2. You'll see your test payment listed
3. Click it to see full details

## Next Steps

Once testing works:

1. **Commit your keys** (in .gitignore or env):
   ```bash
   echo ".env" >> backend/.gitignore
   git add backend/.gitignore
   git commit -m "chore: Add .env to gitignore"
   ```

2. **Test on different devices**: Mobile, tablet
3. **Test error scenarios**: Network failures, expired cards
4. **Read full guide**: `STRIPE_INTEGRATION_GUIDE.md`
5. **Production setup**: Replace test keys with live keys

## Quick Reference

| URL | Purpose |
|-----|---------|
| http://localhost:5173 | Frontend |
| http://localhost:5001 | Backend API |
| https://dashboard.stripe.com/test/payments | View payments |
| https://dashboard.stripe.com/test/apikeys | Get API keys |

## Test Card Cheat Sheet

```
Success:    4242 4242 4242 4242
Declined:   4000 0000 0000 0002
3D Secure:  4000 0025 0000 3155

Always use:
Expiry: 12/25 (or any future date)
CVC: 123 (or any 3 digits)
```

## Troubleshooting Commands

```bash
# Check if backend is running
lsof -i:5001

# Check backend logs
tail -f backend/server.log

# Restart backend
cd backend && node src/server.js

# Check frontend
lsof -i:5173

# View MongoDB data
mongosh newphone
> db.users.find()
> db.phones.find()
```

## Need Help?

1. **Read**: `STRIPE_INTEGRATION_GUIDE.md` (comprehensive)
2. **Check**: Browser DevTools console
3. **Verify**: Backend terminal logs
4. **Stripe Docs**: https://stripe.com/docs/testing

---

**Time to test**: ~5 minutes  
**Difficulty**: Easy  
**What you'll learn**: Complete payment integration flow  
