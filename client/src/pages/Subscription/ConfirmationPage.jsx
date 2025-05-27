import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Download, Mail } from 'lucide-react';
import './SubscriptionStyles.css';
import LeftSidebar from '../../Comnponent/Leftsidebar/Leftsidebar';

const ConfirmationPage = ({ slidein }) => {
  const navigate = useNavigate();
  const subscription = useSelector((state) => state.subscriptionreducer);
  
  useEffect(() => {
    if (!subscription.currentPlan) {
      navigate('/subscription/plans');
    }
  }, [subscription.currentPlan, navigate]);
  
  if (!subscription.currentPlan) {
    return null;
  }
  
  // Format the current date for the invoice
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  // Calculate next billing date (1 month from now)
  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  const formattedNextBillingDate = nextBillingDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div className="home-container-1">
      {slidein && <LeftSidebar />}
      <div className="home-container-2">
        <div className="confirmation-container">
          <div className="confirmation-header">
            <CheckCircle size={48} className="success-icon" />
            <h1>Subscription Confirmed!</h1>
            {subscription.paymentDetails && (
              <p>
                An email confirmation has been sent to <strong>{subscription.paymentDetails.email}</strong>
              </p>
            )}
          </div>
          
          <div className="confirmation-card">
            <div className="confirmation-plan-details">
              <h2>Plan Details</h2>
              <div className="plan-overview">
                <div className="plan-name">{subscription.currentPlan.name}</div>
                <div className="plan-price">{subscription.currentPlan.price}</div>
              </div>
              
              <div className="plan-quota">
                <div className="quota-label">Questions per day:</div>
                <div className="quota-value">{subscription.currentPlan.questionsPerDay}</div>
              </div>
              
              {subscription.currentPlan.id !== 'free' && (
                <div className="billing-details">
                  <div className="billing-row">
                    <div className="billing-label">Start Date:</div>
                    <div className="billing-value">{formattedDate}</div>
                  </div>
                  <div className="billing-row">
                    <div className="billing-label">Next Billing:</div>
                    <div className="billing-value">{formattedNextBillingDate}</div>
                  </div>
                </div>
              )}
            </div>
            
            {subscription.paymentDetails && subscription.currentPlan.id !== 'free' && (
              <div className="payment-details">
                <h2>Payment Details</h2>
                <div className="payment-method">
                  <div className="payment-label">Card ending in:</div>
                  <div className="payment-value">•••• {subscription.paymentDetails.last4}</div>
                </div>
                <div className="payment-date">
                  <div className="payment-label">Payment Date:</div>
                  <div className="payment-value">{formattedDate}</div>
                </div>
                <div className="payment-actions">
                  <button className="action-button">
                    <Download size={16} /> Download Invoice
                  </button>
                  <button className="action-button">
                    <Mail size={16} /> Resend Email
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="confirmation-actions">
            <button className="primary-button" onClick={() => navigate('/')}>
              Return to Home
            </button>
            <button className="secondary-button" onClick={() => navigate('/Askquestion')}>
              Ask a Question
            </button>
          </div>
          
          <div className="subscription-usage">
            <h2>Your Question Usage</h2>
            <div className="usage-counter">
              <div className="usage-label">Questions Available Today:</div>
              <div className="usage-value">
                {subscription.currentPlan.id === 'gold' ? 'Unlimited' : 
                 `${subscription.questionsRemaining || subscription.currentPlan.questionsPerDay} of ${subscription.currentPlan.questionsPerDay}`}
              </div>
            </div>
            <div className="usage-refresh">
              <Clock size={16} />
              <p>Your question limit resets daily at midnight IST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;