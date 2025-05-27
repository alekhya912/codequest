import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './SubscriptionStyles.css';
import { Clock, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { getPaymentTimeStatus } from '../../utils/paymentTimeUtils';
import { selectPlan } from '../../action/subscription';
import LeftSidebar from '../../Comnponent/Leftsidebar/Leftsidebar';

const SubscriptionPlans = ({ slidein }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeStatus, setTimeStatus] = useState({ isPaymentTime: false, message: '' });

  const user = useSelector((state) => state.currentuserreducer);
  const subscription = useSelector((state) => state.subscriptionreducer);

  useEffect(() => {
    const checkPaymentTime = () => {
      const status = getPaymentTimeStatus();
      setTimeStatus(status);
    };

    checkPaymentTime();
    const interval = setInterval(checkPaymentTime, 60000); // check every minute

    return () => clearInterval(interval);
  }, []);

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '₹0',
      features: ['1 question per day', 'Basic support', 'Public profile'],
      questionsPerDay: 1
    },
    {
      id: 'bronze',
      name: 'Bronze Plan',
      price: '₹100/month',
      features: ['5 questions per day', 'Priority support', 'Enhanced profile visibility'],
      questionsPerDay: 5,
      popular: true
    },
    {
      id: 'silver',
      name: 'Silver Plan',
      price: '₹300/month',
      features: ['10 questions per day', 'Premium support', 'Advanced analytics', 'Featured profile'],
      questionsPerDay: 10
    },
    {
      id: 'gold',
      name: 'Gold Plan',
      price: '₹1000/month',
      features: [
        'Unlimited questions',
        '24/7 VIP support',
        'Complete analytics suite',
        'Top profile placement',
        'Custom badge'
      ],
      questionsPerDay: 'Unlimited'
    }
  ];

  const handleSelectPlan = (plan) => {
    if (!user) {
      navigate('/Auth');
      return;
    }

    if (plan.id === 'free') {
      dispatch(selectPlan(plan));
      navigate('/subscription/confirmation');
      return;
    }

    if (!timeStatus.isPaymentTime) {
      alert(`Payment is only allowed between 10:00 AM and 11:00 AM IST.\n${timeStatus.message}`);
      return;
    }

    dispatch(selectPlan(plan));
    navigate('/subscription/payment');
  };

  return (
    <div className="home-container-1">
      {slidein && <LeftSidebar />}
      <div className="home-container-2">
        <div className="subscription-container">
          <h1 className="subscription-title">Choose Your Subscription Plan</h1>

          <div className="time-restriction-banner">
            <Clock size={20} />
            <p>
              {timeStatus.isPaymentTime
                ? 'Payment window is currently open! (10:00 AM - 11:00 AM IST)'
                : `Payments are only accepted between 10:00 AM - 11:00 AM IST. ${timeStatus.message}`}
            </p>
          </div>

          <div className="subscription-plans">
            {plans.map((plan) => {
              const isCurrentPlan = subscription?.currentPlan?.id === plan.id;
              const isPaidPlan = plan.id !== 'free';
              const isDisabled = isCurrentPlan || (isPaidPlan && !timeStatus.isPaymentTime);

              return (
                <div
                  key={plan.id}
                  className={`plan-card ${plan.popular ? 'popular-plan' : ''} ${isCurrentPlan ? 'current-plan' : ''}`}
                >
                  {plan.popular && <div className="popular-badge">POPULAR</div>}
                  {isCurrentPlan && <div className="current-plan-badge">CURRENT PLAN</div>}

                  <h2>{plan.name}</h2>
                  <div className="plan-price">{plan.price}</div>

                  <div className="plan-feature-main">
                    <div className="questions-per-day">
                      <strong>{plan.questionsPerDay}</strong> questions per day
                    </div>
                  </div>

                  <ul className="plan-features">
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <CheckCircle size={16} className="feature-icon" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`plan-button ${isCurrentPlan ? 'current-button' : ''}`}
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isDisabled}
                  >
                    {isCurrentPlan
                      ? 'Current Plan'
                      : plan.id === 'free'
                      ? 'Select Plan'
                      : timeStatus.isPaymentTime
                      ? 'Subscribe Now'
                      : 'Unavailable Now'}
                  </button>

                  {!timeStatus.isPaymentTime && isPaidPlan && !isCurrentPlan && (
                    <div className="time-lock-overlay">
                      <Lock size={16} /> Available only from 10:00 AM to 11:00 AM IST
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="subscription-note">
            <AlertCircle size={20} />
            <p>
              Your subscription plan determines how many questions you can post per day. Choose a plan that fits your
              needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
