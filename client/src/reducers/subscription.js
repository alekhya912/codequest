/**
 * Subscription reducer to manage the subscription state in the application
 */

const initialState = {
  selectedPlan: null,
  currentPlan: {
    id: 'free',
    name: 'Free Plan',
    price: '₹0',
    features: [
      '1 question per day',
      'Basic support',
      'Public profile'
    ],
    questionsPerDay: 1
  },
  questionsRemaining: 1,
  startDate: new Date().toISOString(),
  payments: [],
  paymentDetails: null
};

const subscriptionreducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_PLAN':
      return {
        ...state,
        selectedPlan: action.payload
      };
      
    case 'PURCHASE_PLAN':
      return {
        ...state,
        currentPlan: action.payload.plan,
        questionsRemaining: action.payload.plan.questionsPerDay === 'Unlimited' 
          ? 'Unlimited' 
          : action.payload.plan.questionsPerDay,
        startDate: new Date().toISOString(),
        paymentDetails: action.payload.paymentDetails,
        payments: [
          {
            date: new Date().toISOString(),
            amount: action.payload.plan.price,
            planName: action.payload.plan.name,
            status: 'successful'
          },
          ...state.payments
        ]
      };
      
    case 'USE_QUESTION':
      if (state.currentPlan.id === 'gold' || state.questionsRemaining === 'Unlimited') {
        return state;
      }
      
      return {
        ...state,
        questionsRemaining: Math.max(0, state.questionsRemaining - 1)
      };
      
    case 'RESET_QUESTIONS':
      return {
        ...state,
        questionsRemaining: state.currentPlan.questionsPerDay
      };
      
    case 'CANCEL_SUBSCRIPTION':
      return {
        ...state,
        currentPlan: initialState.currentPlan,
        questionsRemaining: initialState.questionsRemaining
      };
      
    default:
      return state;
  }
};

export default subscriptionreducer;