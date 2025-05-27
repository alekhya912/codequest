// backend/routes/razorpay.js

const express = require('express');
const Razorpay = require('razorpay');
const timeRestriction = require('../middleware/timeRestriction'); // <== Import the middleware

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Route to create a new subscription (only allowed 10–11 AM IST)
router.post('/create-subscription', timeRestriction, async (req, res) => {
  const { plan_id, customer_notify, total_count } = req.body;

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id,
      customer_notify,
      total_count,
    });

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
