# Stripe Payment Integration Guide

## ✅ Integration Complete

Stripe payment gateway has been successfully integrated into the NewPhone checkout flow.

## 🔑 Stripe Setup Required

**⚠️ IMPORTANT: The current .env file contains placeholder test keys that won't work with real Stripe API.**

To test payment functionality, you need to:

1. **Create a Stripe Account** (Free): https://dashboard.stripe.com/register
2. **Get Your Test API Keys**: https://dashboard.stripe.com/test/apikeys
3. **Update backend/.env** with your real test keys:
   ```bash
   STRIPE_SECRET_KEY=sk_test_YOUR_REAL_SECRET_KEY
   STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_REAL_PUBLISHABLE_KEY
   ```
4. **Update frontend StripeWrapper.jsx** with your publishable key
5. **Restart backend server**

**Current Keys (Placeholders - Won't Work):**
- Publishable Key: `pk_test_51QRKg22LtjXn6jyX...` (Example format)
- Secret Key: `sk_test_51QRKg22LtjXn6jyX...` (Example format)

**Test Cards:**
- **Success**: `4242 4242 4242 4242` (any future date, any 3-digit CVC)
- **Declined**: `4000 0000 0000 0002` (tests payment failure)
- **Requires Authentication**: `4000 0025 0000 3155` (tests 3D Secure)

## 🏗️ Architecture

### Backend (Node.js/Express)
**Files Modified/Created:**
- `backend/src/controllers/paymentController.js` - Payment intent creation & verification
- `backend/src/routes/paymentRoutes.js` - Payment API routes
- `backend/src/server.js` - Registered payment routes
- `backend/.env` - Added Stripe secret key

**API Endpoints:**
- `POST /api/payment/create-payment-intent` (auth required)
  - Request: `{ amount: number }` (in paise/smallest unit)
  - Response: `{ clientSecret: string }`
  
- `POST /api/payment/verify-payment` (auth required)
  - Request: `{ paymentIntentId: string }`
  - Response: `{ status: string, amount: number }`

### Frontend (React/Vite)
**Files Modified/Created:**
- `src/components/StripeWrapper.jsx` - Stripe Elements provider wrapper
- `src/pages/checkout/Checkout.jsx` - Complete checkout with Stripe CardElement
- `src/pages/checkout/Checkout.css` - Stripe-specific styles
- `src/App.jsx` - Wrapped checkout route with StripeWrapper

**Packages Installed:**
- `@stripe/stripe-js` - Stripe.js library
- `@stripe/react-stripe-js` - React Stripe Elements components

## 🔄 Payment Flow

1. **User adds phone to cart** → localStorage
2. **Navigate to /checkout** → User must be logged in
3. **Fill contact & delivery info** → Form validation
4. **Load payment form** → StripeWrapper initializes Stripe.js
5. **Enter card details** → Stripe CardElement (secure iframe)
6. **Submit payment:**
   - Frontend calls `POST /api/payment/create-payment-intent` with total amount
   - Backend creates PaymentIntent via Stripe API
   - Backend returns `clientSecret`
   - Frontend calls `stripe.confirmCardPayment()` with card details
   - Stripe processes payment (may trigger 3D Secure)
   - On success: clear cart, save order, redirect to confirmation
   - On failure: display error message

7. **Order confirmation** → Display order details with payment ID

## 🧪 Testing Instructions

### 1. Start Services (Already Running)
```bash
# Backend (Port 5001)
cd backend && node src/server.js

# Frontend (Port 5173)
npm run dev
```

### 2. Browser Testing Flow

**Step 1: Create Account / Login**
- Visit: http://localhost:5173/login
- Create a new account or login with existing credentials
- Verify you're redirected to homepage with username in navbar

**Step 2: Add Phone to Cart**
- Visit: http://localhost:5173/phones
- Click on any phone to view details
- Click "Add to Cart" button
- Verify cart badge in navbar shows count
- Click "Buy Now" to go directly to checkout

**Step 3: Complete Checkout**
- Fill in contact information:
  - Full Name: "Test User"
  - Email: "test@example.com"
  - Phone: "9876543210"
  
- Fill in delivery address:
  - Address Line 1: "123 Test Street"
  - Address Line 2: "Apartment 4B"
  - City: "Mumbai"
  - State: "Maharashtra"
  - PIN Code: "400001"

**Step 4: Payment Testing**

**Test Case 1: Successful Payment**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)
- Click "Pay ₹XX,XXX"
- ✅ Expected: Redirects to /order-confirmation with payment details

**Test Case 2: Declined Card**
- Card Number: `4000 0000 0000 0002`
- Expiry: `12/25`
- CVC: `123`
- Click "Pay ₹XX,XXX"
- ❌ Expected: Shows error "Your card was declined. Please try another card."

**Test Case 3: 3D Secure Authentication**
- Card Number: `4000 0025 0000 3155`
- Expiry: `12/25`
- CVC: `123`
- Click "Pay ₹XX,XXX"
- ✅ Expected: Opens 3D Secure popup, complete auth, payment succeeds

**Test Case 4: Incomplete Card Details**
- Leave card number incomplete or use invalid format
- ✅ Expected: "Complete Payment" button remains disabled

**Test Case 5: Unauthenticated User**
- Logout and try to access /checkout directly
- ✅ Expected: Redirects to /login or shows auth error

### 3. Network Inspection
Open browser DevTools → Network tab:

**Check Request to Backend:**
```
POST http://localhost:5001/api/payment/create-payment-intent
Headers:
  Authorization: Bearer <jwt-token>
  Content-Type: application/json
Body:
  { "amount": 50000 }
Response:
  { "clientSecret": "pi_xxx_secret_xxx" }
```

**Check Stripe API Call:**
```
POST https://api.stripe.com/v1/payment_intents/:id/confirm
(Handled by Stripe.js - card details never touch your server)
```

## 🔒 Security Features

1. **PCI Compliance**: Card details handled entirely by Stripe via iframe (CardElement)
2. **Authentication Required**: Payment APIs require valid JWT token
3. **HTTPS in Production**: All Stripe API calls use HTTPS
4. **Amount Validation**: Backend validates amount > 0
5. **No Card Storage**: Card data never stored on your servers
6. **Test Mode**: Using test keys, no real money processed

## 📊 Order Data Structure (localStorage)

After successful payment:
```json
{
  "orderId": "ORD-1234567890123",
  "items": [
    {
      "id": "phone_id",
      "brand": "Apple",
      "model": "iPhone 14 Pro",
      "price": 55999,
      "storage": "128GB",
      "color": "Space Black"
    }
  ],
  "total": 55999,
  "paymentId": "pi_xxx",
  "contact": {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210"
  },
  "address": {
    "line1": "123 Test Street",
    "line2": "Apartment 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## 🚀 Next Steps for Production

### 1. Replace Test Keys with Live Keys
```bash
# backend/.env
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

### 2. Move Frontend Key to Environment Variable
```javascript
// src/components/StripeWrapper.jsx
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
```

### 3. Implement Order Database Storage
- Create `Order` model in MongoDB
- Save order details to database instead of localStorage
- Link orders to user accounts

### 4. Add Webhooks for Payment Events
```javascript
// backend/src/routes/webhookRoutes.js
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  
  if (event.type === 'payment_intent.succeeded') {
    // Update order status in database
  }
});
```

### 5. Enable Additional Security
- Add rate limiting on payment endpoints
- Implement amount verification (check cart total matches payment amount)
- Add fraud detection (Stripe Radar)
- Enable 3D Secure authentication for all transactions

### 6. Enhance User Experience
- Add payment loading animation
- Show payment processing status
- Send order confirmation email
- Add order tracking page
- Implement refund functionality

## 📝 Current Status

✅ Stripe packages installed (frontend + backend)  
✅ Payment controller with intent creation & verification  
✅ Payment routes registered and authenticated  
✅ Stripe CardElement integrated into checkout  
✅ Complete payment flow implemented  
✅ Error handling for payment failures  
✅ Cart clearing on successful payment  
✅ Order confirmation page with payment details  
✅ Test card instructions displayed in UI  
✅ Backend server running with payment routes  
✅ Frontend routing updated with StripeWrapper  

**Ready for browser testing!**

## 🐛 Troubleshooting

**Issue: "Unauthorized" error on payment**
- Solution: Ensure user is logged in, check JWT token in localStorage

**Issue: CardElement not showing**
- Solution: Check browser console for Stripe.js loading errors
- Verify Stripe publishable key is correct

**Issue: Payment button disabled**
- Solution: Fill all required form fields and enter complete card details

**Issue: Backend payment endpoint 404**
- Solution: Restart backend server: `cd backend && node src/server.js`

**Issue: CORS errors**
- Solution: Verify CORS is enabled in backend/src/server.js

**Issue: Database connection error**
- Solution: Ensure MongoDB is running locally on port 27017

## 📞 Support

For Stripe API documentation: https://stripe.com/docs/api
For React Stripe Elements: https://stripe.com/docs/stripe-js/react

---
**Integration Date**: January 2024  
**Test Mode**: Active  
**Currency**: INR (Indian Rupees)
