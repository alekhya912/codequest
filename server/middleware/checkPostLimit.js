const moment = require('moment-timezone');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const userId = req.user.id; // Assuming user ID is available in req.user
  const user = await User.findById(userId).populate('friends');

  const today = moment().tz('Asia/Kolkata').startOf('day');

  if (!user.lastPostDate || moment(user.lastPostDate).isBefore(today)) {
    user.postsToday = 0;
    user.lastPostDate = today.toDate();
  }

  const friendCount = user.friends.length;

  let postLimit = 0;
  if (friendCount === 0) postLimit = 0;
  else if (friendCount === 1) postLimit = 1;
  else if (friendCount >= 2 && friendCount <= 10) postLimit = 2;
  else postLimit = Infinity;

  if (user.postsToday >= postLimit) {
    return res.status(403).json({ message: 'Daily post limit reached' });
  }

  user.postsToday += 1;
  await user.save();

  next();
};
