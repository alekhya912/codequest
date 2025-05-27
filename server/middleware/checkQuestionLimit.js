import moment from 'moment-timezone';
import { findById } from '../models/User';

export default async function (req, res, next) {
  const userId = req.user.id; // Assuming user ID is available in req.user
  const user = await findById(userId);

  const today = moment().tz('Asia/Kolkata').startOf('day');

  if (!user.subscription || !user.subscription.planId) {
    return res.status(403).json({ message: 'No active subscription' });
  }

  if (!user.subscription.lastQuestionDate || moment(user.subscription.lastQuestionDate).isBefore(today)) {
    user.subscription.questionsAskedToday = 0;
    user.subscription.lastQuestionDate = today.toDate();
  }

  const planLimits = {
    'free_plan_id': 1,
    'bronze_plan_id': 5,
    'silver_plan_id': 10,
    'gold_plan_id': Infinity,
  };

  const limit = planLimits[user.subscription.planId] || 0;

  if (user.subscription.questionsAskedToday >= limit) {
    return res.status(403).json({ message: 'Daily question limit reached' });
  }

  user.subscription.questionsAskedToday += 1;
  await user.save();

  next();
};
