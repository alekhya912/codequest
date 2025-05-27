const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const Subscription = require('../models/subscription'); // Mongoose model
const User = require('../models/User'); // Mongoose model

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Middleware to check if current time is between 10-11 AM IST
function isWithinPaymentWindow(req, res, next) {
  const currentTime = moment().tz('Asia/Kolkata');
  const startTime = moment().tz('Asia/Kolkata').hour(10).minute(0);
  const endTime = moment().tz('Asia/Kolkata').hour(11).minute(0);

  if (currentTime.isBetween(startTime, endTime)) {
    next();
  } else {
    return res.status(403).json({ message: 'Payments are allowed only between 10-11 AM IST' });
  }
}

// Route to create a subscription
router.post('/create-subscription', isWithinPaymentWindow, async (req, res) => {
  const { planId, userId } = req.body;

  try {
    const user = await User.findById(userId);

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12,
    });

    // Save subscription details in the database
    const newSubscription = new Subscription({
      userId,
      razorpaySubscriptionId: subscription.id,
      planId,
      status: subscription.status,
      startAt: subscription.start_at,
      endAt: subscription.end_at,
    });

    await newSubscription.save();

    // Send invoice and plan details via email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Subscription Confirmation',
      text: `Dear ${user.name},\n\nYour subscription for plan ${planId} has been activated.\n\nThank you!`,
    };

    transporter.sendMail(mailOptions);

    res.json({ message: 'Subscription created successfully', subscriptionId: subscription.id });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
