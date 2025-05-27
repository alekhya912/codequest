/**
 * Utility functions to restrict usage between 10:00 AM and 11:00 AM IST only
 */

/**
 * Converts current time to IST (UTC+5:30)
 */
const getISTTime = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 mins
  return new Date(now.getTime() + (istOffset + now.getTimezoneOffset() * 60 * 1000));
};

/**
 * Checks if the current IST time is between 10:00 AM and 11:00 AM
 */
const isWithinPaymentWindow = () => {
  const istTime = getISTTime();
  const hour = istTime.getUTCHours();
  const minute = istTime.getUTCMinutes();
  return hour === 10 || (hour === 11 && minute === 0); // Allow until exactly 11:00 AM
};

/**
 * Main function: Executes only during allowed payment window
 */
export const getPaymentTimeStatus = () => {
  const nowIST = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const currentTimeIST = new Date(nowIST);

  const hours = currentTimeIST.getHours();

  const isPaymentTime = hours === 10; // 10:00 - 10:59 AM IST

  const timeString = currentTimeIST.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });

  return {
    isPaymentTime,
    message: `Current IST time: ${timeString}`
  };
};


/**
 * Returns current IST time as string
 * Executes only during allowed window
 */
export const getCurrentISTTimeString = () => {
  if (!isWithinPaymentWindow()) {
    return 'Access denied: Current time is outside the allowed 10:00 AM – 11:00 AM IST window.';
  }

  const istTime = getISTTime();
  return istTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  }) + ' IST';
};
