import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createPaymentIntent,
  verifyPayment,
} from '../controllers/paymentController.js';

const router = Router();

// Create payment intent (requires authentication)
router.post('/create-payment-intent', authMiddleware, createPaymentIntent);

// Verify payment status
router.post('/verify-payment', authMiddleware, verifyPayment);

export default router;
