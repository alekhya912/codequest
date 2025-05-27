import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Clock, ArrowLeft } from 'lucide-react';
import './SubscriptionStyles.css';
import { getPaymentTimeStatus } from '../../utils/paymentTimeUtils';
import { processPayment } from '../../action/subscription';
import LeftSidebar from '../../Comnponent/Leftsidebar/Leftsidebar';

const PaymentGateway = ({ slidein }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [timeStatus, setTimeStatus] = useState({ isPaymentTime: false, message: '' });
  
  const user = useSelector((state) => state.currentuserreducer);
  const selectedPlan = useSelector((state) => state.subscriptionreducer?.selectedPlan);
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    email: user?.result?.email || ''
  });
  
  useEffect(() => {
    if (!selectedPlan) {
      navigate('/subscription/plans');
      return;
    }
    
    const checkPaymentTime = () => {
      const status = getPaymentTimeStatus();
      setTimeStatus(status);
      
      if (!status.isPaymentTime) {
        alert(`Payment is only available between 10:00 AM and 11:00 AM IST.\n${status.message}`);
        navigate('/subscription/plans');
      }
    };
    
    checkPaymentTime();
    const interval = setInterval(checkPaymentTime, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [selectedPlan, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!timeStatus.isPaymentTime) {
      alert(`Payment is only available between 10:00 AM and 11:00 AM IST.\n${timeStatus.message}`);
      navigate('/subscription/plans');
      return;
    }
    
    setLoading(true);
    
    try {
      // Here we would typically integrate with a real payment gateway
      // For now, we'll simulate a successful payment
      await dispatch(processPayment({
        plan: selectedPlan,
        user: user?.result,
        paymentDetails: {
          last4: formData.cardNumber.slice(-4),
          email: formData.email
        }
      }));
      
      // Navigate to confirmation page
      navigate('/subscription/confirmation');
    } catch (error) {
      alert('Payment failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };
  
  return (
    <div className="home-container-1">
      {slidein && <LeftSidebar />}
      <div className="home-container-2">
        <div className="payment-container">
          <button className="back-button" onClick={() => navigate('/subscription/plans')}>
            <ArrowLeft size={16} /> Back to Plans
          </button>
          
          <div className="time-restriction-banner">
            <Clock size={20} />
            <p>
              {timeStatus.isPaymentTime 
                ? "Payment window is currently open! (10:00 AM - 11:00 AM IST)" 
                : `Payments are only accepted between 10:00 AM - 11:00 AM IST. ${timeStatus.message}`}
            </p>
          </div>
          
          <div className="payment-layout">
            <div className="payment-summary">
              <h2>Order Summary</h2>
              {selectedPlan && (
                <>
                  <div className="selected-plan">
                    <h3>{selectedPlan.name}</h3>
                    <p className="plan-price">{selectedPlan.price}</p>
                  </div>
                  <div className="plan-benefits">
                    <h4>What you'll get:</h4>
                    <ul>
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="payment-total">
                    <div className="total-label">Total:</div>
                    <div className="total-amount">{selectedPlan.price}</div>
                  </div>
                </>
              )}
            </div>
            
            <div className="payment-form-container">
              <form className="payment-form" onSubmit={handleSubmit}>
                <h2>Payment Information</h2>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <div className="card-input-container">
                    <CreditCard size={20} className="card-icon" />
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        if (e.target.value.replace(/\s/g, '').length <= 16) {
                          setFormData({
                            ...formData,
                            cardNumber: formatCardNumber(e.target.value)
                          });
                        }
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="cardHolder">Cardholder Name</label>
                  <input
                    type="text"
                    id="cardHolder"
                    name="cardHolder"
                    value={formData.cardHolder}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          if (value.length > 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2);
                          }
                          setFormData({
                            ...formData,
                            expiryDate: value
                          });
                        }
                      }}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  
                  <div className="form-group half">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={(e) => {
                        if (/^\d{0,3}$/.test(e.target.value)) {
                          setFormData({
                            ...formData,
                            cvv: e.target.value
                          });
                        }
                      }}
                      placeholder="123"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email for Receipt</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="payment-button"
                  disabled={loading || !timeStatus.isPaymentTime}
                >
                  {loading ? 'Processing...' : `Pay ${selectedPlan?.price}`}
                </button>
              </form>
            </div>
          </div>
          
          <div className="payment-security-note">
            <p>🔒 Payment information is securely processed and never stored on our servers. Your card details are encrypted and protected.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;