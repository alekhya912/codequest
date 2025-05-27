// routes/webhook.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/razorpay-webhook', async (req, res) => {
  const event = req.body.event;

  if (event === 'subscription.charged') {
    const email = req.body.payload.payment.entity.email;
    const planDetails = req.body.payload.subscription.entity;

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Subscription Activated',
      text: `Your subscription for plan ${planDetails.plan_id} has been activated.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: 'Email sent successfully' });
    });
  } else {
    res.status(200).json({ message: 'Event not handled' });
  }
});
