import express from 'express';
import { getPayment, verifyPayment } from '../controllers/payments.controllers.js';

const router = express.Router();

router.post("/create-order", getPayment);
router.post("/verify-payment/:txnid/:appointmentId",verifyPayment);



export default router