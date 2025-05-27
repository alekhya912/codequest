/**
 * Subscription related actions for managing user subscription plans
 */

/**
 * Select a subscription plan
 * 
 * @param {Object} plan - The selected subscription plan
 * @returns {Object} Action object
 */
export const selectPlan = (plan) => {
  return {
    type: 'SELECT_PLAN',
    payload: plan
  };
};

/**
 * Process payment and purchase a subscription plan
 * 
 * @param {Object} paymentData - Payment data including plan, user, and payment details
 * @returns {Function} Async function that dispatches actions
 */
export const processPayment = (paymentData) => async (dispatch) => {
  try {
    // In a real application, this would make an API call to process the payment
    // and save the subscription information in the database
    
    // For demo purposes, we'll simulate a successful API call
    setTimeout(() => {
      // Send email with invoice (simulated)
      console.log(`Sending email to ${paymentData.paymentDetails.email} with invoice for ${paymentData.plan.name}`);
    }, 1000);
    
    // Update the subscription in the database (simulated)
    // const response = await API.post('/subscription/purchase', paymentData);
    
    // Update the subscription in the Redux store
    dispatch({
      type: 'PURCHASE_PLAN',
      payload: paymentData
    });
    
    return true;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

/**
 * Record usage of a question (decrement the remaining questions counter)
 * 
 * @returns {Object} Action object
 */
export const useQuestion = () => {
  return {
    type: 'USE_QUESTION'
  };
};

/**
 * Reset the questions counter (typically called daily at midnight)
 * 
 * @returns {Object} Action object
 */
export const resetQuestions = () => {
  return {
    type: 'RESET_QUESTIONS'
  };
};

/**
 * Cancel the current subscription
 * 
 * @returns {Function} Async function that dispatches actions
 */
export const cancelSubscription = () => async (dispatch) => {
  try {
    // In a real application, this would make an API call to cancel the subscription
    // const response = await API.post('/subscription/cancel');
    
    dispatch({
      type: 'CANCEL_SUBSCRIPTION'
    });
    
    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

/**
 * Check if user has remaining questions they can post
 * 
 * @returns {Function} Function that checks the current state
 */
export const canPostQuestion = () => (getState) => {
  const state = getState();
  const { currentPlan, questionsRemaining } = state.subscriptionreducer;
  
  if (currentPlan.id === 'gold' || questionsRemaining === 'Unlimited') {
    return true;
  }
  
  return questionsRemaining > 0;
};