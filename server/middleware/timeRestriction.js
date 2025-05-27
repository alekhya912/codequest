// middleware/timeRestriction.js
export default (req, res, next) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // Convert to IST
  const istTime = new Date(currentTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const istHour = istTime.getHours();
  const istMinute = istTime.getMinutes();

  if (istHour === 10) {
    next();
  } else {
    return res.status(403).json({ message: 'Payments are allowed only between 10:00 AM and 11:00 AM IST' });
  }
};
