import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlertCircle, Award, ArrowUpCircle } from 'lucide-react';
import './SubscriptionStyles.css';
import LeftSidebar from '../../Comnponent/Leftsidebar/Leftsidebar';

const SubscriptionStatus = ({ slidein }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentuserreducer);
  const subscription = useSelector((state) => state.subscriptionreducer);
  
  if (!user) {
    navigate('/Auth');
    return null;
  }
  
  const getPlanColor = (planId) => {
    switch(planId) {
      case 'bronze': return '#cd7f32';
      case 'silver': return '#c0c0c0';
      case 'gold': return '#ffd700';
      default: return '#009dff'; // Default blue
    }
  };
  
  // Format dates
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const currentDate = new Date();
  const startDate = subscription?.startDate ? formatDate(subscription.startDate) : formatDate(currentDate);
  
  // Calculate next billing date if applicable
  let nextBillingDate = null;
  if (subscription?.currentPlan?.id !== 'free' && subscription?.startDate) {
    const nextBilling = new Date(subscription.startDate);
    nextBilling.setMonth(nextBilling.getMonth() + 1);
    nextBillingDate = formatDate(nextBilling);
  }
  
  return (
    <div className="home-container-1">
      {slidein && <LeftSidebar />}
      <div className="home-container-2">
        <div className="subscription-status-container">
          <h1 className="subscription-title">Your Subscription</h1>
          
          <div className="subscription-overview">
            <div 
              className="current-plan-badge-large"
              style={{ backgroundColor: getPlanColor(subscription?.currentPlan?.id) }}
            >
              <Award size={24} />
              <span>{subscription?.currentPlan?.name || 'Free Plan'}</span>
            </div>
            
            <div className="question-quota-display">
              <h3>Daily Question Limit</h3>
              <div className="quota-count">
                {subscription?.currentPlan?.id === 'gold' ? (
                  <span className="unlimited">Unlimited</span>
                ) : (
                  <>
                    <span className="used">
                      {subscription?.questionsRemaining || subscription?.currentPlan?.questionsPerDay || 1}
                    </span>
                    <span className="separator">/</span>
                    <span className="total">
                      {subscription?.currentPlan?.questionsPerDay || 1}
                    </span>
                  </>
                )}
              </div>
              <p className="quota-reset">Resets daily at midnight IST</p>
            </div>
          </div>
          
          <div className="subscription-details-card">
            <h2>Subscription Details</h2>
            
            <div className="subscription-info-grid">
              <div className="info-item">
                <div className="info-label">Current Plan</div>
                <div className="info-value">{subscription?.currentPlan?.name || 'Free Plan'}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Monthly Price</div>
                <div className="info-value">{subscription?.currentPlan?.price || '₹0'}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Start Date</div>
                <div className="info-value">{startDate}</div>
              </div>
              
              {nextBillingDate && (
                <div className="info-item">
                  <div className="info-label">Next Billing Date</div>
                  <div className="info-value">{nextBillingDate}</div>
                </div>
              )}
              
              <div className="info-item">
                <div className="info-label">Question Limit</div>
                <div className="info-value">
                  {subscription?.currentPlan?.id === 'gold' 
                    ? 'Unlimited' 
                    : `${subscription?.currentPlan?.questionsPerDay || 1} per day`}
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Questions Available Today</div>
                <div className="info-value">
                  {subscription?.currentPlan?.id === 'gold' 
                    ? 'Unlimited' 
                    : `${subscription?.questionsRemaining || subscription?.currentPlan?.questionsPerDay || 1}`}
                </div>
              </div>
            </div>
            
            <div className="plan-features-list">
              <h3>Your Plan Benefits</h3>
              <ul>
                {subscription?.currentPlan?.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                )) || (
                  <>
                    <li>1 question per day</li>
                    <li>Basic support</li>
                    <li>Public profile</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          <div className="subscription-actions-card">
            <div className="action-info">
              <h3>Want more questions?</h3>
              <p>Upgrade your plan to ask more questions and get additional benefits.</p>
            </div>
            <div className="action-buttons">
              <button 
                className="upgrade-button" 
                onClick={() => navigate('/subscription/plans')}
              >
                <ArrowUpCircle size={16} /> Upgrade Plan
              </button>
            </div>
          </div>
          
          {subscription?.currentPlan?.id !== 'free' && (
            <div className="payment-history">
              <h2>Payment History</h2>
              {subscription?.payments?.length > 0 ? (
                <table className="payment-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscription.payments.map((payment, index) => (
                      <tr key={index}>
                        <td>{formatDate(payment.date)}</td>
                        <td>{payment.amount}</td>
                        <td>{payment.planName}</td>
                        <td>
                          <span className="payment-status success">Successful</span>
                        </td>
                        <td>
                          <button className="table-action">View Invoice</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-history">
                  <Calendar size={32} />
                  <p>No payment history yet</p>
                </div>
              )}
            </div>
          )}
          
          <div className="subscription-note">
            <AlertCircle size={20} />
            <p>Remember, subscription payments are only accepted between 10:00 AM - 11:00 AM IST.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;