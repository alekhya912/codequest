import mongoose from 'mongoose';
import Subscription from '../models/subscription.js';
import User from '../models/auth.js';
import stripe from 'stripe';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Initialize Stripe with your secret key
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Check if the current time is within the payment window (10-11 AM IST)
export const checkTimeRestriction = async (req, res) => {
  try {
    const now = new Date();
    
    // Convert to IST (UTC+5:30)
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const istHour = istTime.getUTCHours();
    
    // Check if time is between 10-11 AM IST
    const isAllowed = istHour >= 10 && istHour < 11;
    
    let message = isAllowed 
      ? 'Payment window is open!' 
      : 'Payments can only be processed between 10 AM - 11 AM IST.';
    
    return res.status(200).json({ allowed: isAllowed, message });
  } catch (error) {
    return res.status(500).json({ message: 'Error checking time restriction', error: error.message });
  }
};

// Get a user's subscription details
export const getUserSubscription = async (req, res) => {
  const { userId } = req.params;
  
  try {
    let subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      // If no subscription exists, return free tier details
      return res.status(200).json({ 
        plan: 'Free', 
        questionsPerDay: 1,
        questionsAsked: 0,
        lastQuestionDate: null, 
        nextBillingDate: null 
      });
    }
    
    // Reset question count if it's a new day
    const today = new Date().toISOString().split('T')[0];
    const lastQuestionDate = subscription.lastQuestionDate ? 
      new Date(subscription.lastQuestionDate).toISOString().split('T')[0] : null;
    
    if (lastQuestionDate !== today) {
      subscription.questionsAsked = 0;
      await subscription.save();
    }
    
    return res.status(200).json(subscription);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching subscription', error: error.message });
  }
};

// Process payment and create subscription
export const processPayment = async (req, res) => {
  const { paymentMethodId, plan, userId, email } = req.body;
  
  try {
    // Check time restriction
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const istHour = istTime.getUTCHours();
    
    if (!(istHour >= 10 && istHour < 11)) {
      return res.status(403).json({ 
        message: 'Payments can only be processed between 10 AM - 11 AM IST.' 
      });
    }
    
    // Set plan details
    const planDetails = {
      'Bronze': { price: 100, questionsPerDay: 5 },
      'Silver': { price: 300, questionsPerDay: 10 },
      'Gold': { price: 1000, questionsPerDay: Number.MAX_SAFE_INTEGER } // Unlimited
    };
    
    if (!planDetails[plan]) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }
    
    // Create a customer if they don't exist
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let customer;
    if (!user.stripeCustomerId) {
      customer = await stripeClient.customers.create({
        email: email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      
      user.stripeCustomerId = customer.id;
      await user.save();
    } else {
      customer = await stripeClient.customers.retrieve(user.stripeCustomerId);
      
      // Update the payment method
      await stripeClient.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });
      
      await stripeClient.customers.update(customer.id, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    }
    
    // Calculate amount in paisa (rupees * 100)
    const amount = planDetails[plan].price * 100;
    
    // Create payment
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amount,
      currency: 'inr',
      customer: customer.id,
      payment_method: paymentMethodId,
      confirm: true,
      description: `${plan} Plan Subscription - StackOverflow Clone`,
    });
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment failed' });
    }
    
    // Calculate next billing date (1 month from now)
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    
    // Create or update the subscription
    let subscription = await Subscription.findOne({ userId });
    
    if (subscription) {
      subscription.plan = plan;
      subscription.questionsPerDay = planDetails[plan].questionsPerDay;
      subscription.nextBillingDate = nextBillingDate;
      subscription.questionsAsked = 0; // Reset question count
      subscription.lastQuestionDate = new Date();
      await subscription.save();
    } else {
      subscription = await Subscription.create({
        userId,
        plan,
        questionsPerDay: planDetails[plan].questionsPerDay,
        questionsAsked: 0,
        lastQuestionDate: new Date(),
        nextBillingDate
      });
    }
    
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your ${plan} Plan Subscription - StackOverflow Clone`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Thank You for Your Subscription!</h2>
          <p>Dear ${user.name},</p>
          <p>Your subscription to the <strong>${plan} Plan</strong> has been successfully processed.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Subscription Details:</h3>
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Amount:</strong> ₹${planDetails[plan].price}/month</p>
            <p><strong>Questions per day:</strong> ${planDetails[plan].questionsPerDay === Number.MAX_SAFE_INTEGER ? 'Unlimited' : planDetails[plan].questionsPerDay}</p>
            <p><strong>Next billing date:</strong> ${nextBillingDate.toLocaleDateString('en-IN')}</p>
            <p><strong>Transaction ID:</strong> ${paymentIntent.id}</p>
          </div>
          <p>You can now ask ${planDetails[plan].questionsPerDay === Number.MAX_SAFE_INTEGER ? 'unlimited' : planDetails[plan].questionsPerDay} questions per day. Your subscription will automatically renew on ${nextBillingDate.toLocaleDateString('en-IN')}.</p>
          <p>If you have any questions or need support, please contact our support team.</p>
          <p style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      `
    };
    
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Email sending error:', error);
      }
    });
    
    return res.status(200).json({
      message: 'Payment successful',
      success: true,
      plan,
      questionsPerDay: planDetails[plan].questionsPerDay,
      nextBillingDate
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({ 
      message: 'Error processing payment', 
      error: error.message 
    });
  }
};

// Subscribe to free plan
export const subscribeToFreePlan = async (req, res) => {
  const { userId } = req.body;
  
  try {
    let subscription = await Subscription.findOne({ userId });
    
    if (subscription) {
      subscription.plan = 'Free';
      subscription.questionsPerDay = 1;
      subscription.questionsAsked = 0;
      subscription.nextBillingDate = null;
      await subscription.save();
    } else {
      subscription = await Subscription.create({
        userId,
        plan: 'Free',
        questionsPerDay: 1,
        questionsAsked: 0,
        lastQuestionDate: new Date(),
        nextBillingDate: null
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Subscribed to Free plan successfully' 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error subscribing to Free plan', 
      error: error.message 
    });
  }
};

// Check if user can ask a question
export const checkQuestionLimit = async (req, res) => {
  const userId = req.userId; // From auth middleware
  
  try {
    let subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      // Free tier by default
      subscription = {
        plan: 'Free',
        questionsPerDay: 1,
        questionsAsked: 0
      };
    }
    
    // Reset counter if it's a new day
    const today = new Date().toISOString().split('T')[0];
    const lastQuestionDate = subscription.lastQuestionDate ? 
      new Date(subscription.lastQuestionDate).toISOString().split('T')[0] : null;
    
    if (lastQuestionDate !== today) {
      subscription.questionsAsked = 0;
      if (subscription._id) { // Only save if it's a database document
        await subscription.save();
      }
    }
    
    const canAsk = subscription.questionsAsked < subscription.questionsPerDay;
    
    return res.status(200).json({
      canAsk,
      questionsAsked: subscription.questionsAsked,
      questionsPerDay: subscription.questionsPerDay,
      message: canAsk ? 
        'You can ask a question' : 
        `You've reached your daily limit of ${subscription.questionsPerDay} questions for your ${subscription.plan} plan.`
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error checking question limit', 
      error: error.message,
      canAsk: false // Default to restricted for safety
    });
  }
};

// Increment the count of questions asked today
export const incrementQuestionCount = async (req, res) => {
  const userId = req.userId; // From auth middleware
  
  try {
    let subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      // Create a new free subscription
      subscription = await Subscription.create({
        userId,
        plan: 'Free',
        questionsPerDay: 1,
        questionsAsked: 1, // First question
        lastQuestionDate: new Date(),
        nextBillingDate: null
      });
    } else {
      // Reset counter if it's a new day
      const today = new Date().toISOString().split('T')[0];
      const lastQuestionDate = subscription.lastQuestionDate ? 
        new Date(subscription.lastQuestionDate).toISOString().split('T')[0] : null;
      
      if (lastQuestionDate !== today) {
        subscription.questionsAsked = 1; // Reset and count this question
      } else {
        subscription.questionsAsked += 1;
      }
      
      subscription.lastQuestionDate = new Date();
      await subscription.save();
    }
    
    return res.status(200).json({
      success: true,
      questionsAsked: subscription.questionsAsked,
      questionsPerDay: subscription.questionsPerDay
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error incrementing question count', 
      error: error.message 
    });
  }
};