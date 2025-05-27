import mongoose from 'mongoose';

const subscriptionSchema = mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  plan: { 
    type: String, 
    required: true, 
    enum: ['Free', 'Bronze', 'Silver', 'Gold'],
    default: 'Free'
  },
  questionsPerDay: { 
    type: Number, 
    required: true, 
    default: 1 
  },
  questionsAsked: { 
    type: Number, 
    default: 0 
  },
  lastQuestionDate: { 
    type: Date,
    default: null
  },
  nextBillingDate: { 
    type: Date,
    default: null
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('Subscription', subscriptionSchema);