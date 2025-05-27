import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Askquestion.css';
import { askquestion } from '../../action/question';
import { useQuestion } from '../../action/subscription';
import { AlertCircle } from 'lucide-react';

const Askquestion = () => {
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionBody, setQuestionBody] = useState('');
  const [questionTags, setQuestionTags] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const User = useSelector((state) => state.currentuserreducer);
  const subscription = useSelector((state) => state.subscriptionreducer);

  // Check if the user has remaining questions to post
  const checkCanPostQuestion = () => {
    if (subscription.currentPlan.id === 'gold' || subscription.questionsRemaining === 'Unlimited') {
      return true;
    }
    
    return subscription.questionsRemaining > 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!User) {
      setError('Login or signup to ask a question');
      return;
    }
    
    if (!checkCanPostQuestion()) {
      setError(`You've reached your daily limit of ${subscription.currentPlan.questionsPerDay} questions. Upgrade your plan to ask more questions.`);
      return;
    }
    
    if (questionTitle === '' || questionBody === '') {
      setError('Please enter a title and description for your question');
      return;
    }
    
    if (questionTags === '') {
      setError('Please enter at least one tag');
      return;
    }

    dispatch(askquestion(
      { 
        questionTitle, 
        questionBody, 
        questionTags, 
        userPosted: User.result.name,
        userId: User.result._id
      }, 
      navigate
    ));
    
    // Decrement the question counter
    if (subscription.currentPlan.id !== 'gold' && subscription.questionsRemaining !== 'Unlimited') {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      dispatch(useQuestion());
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      setQuestionBody(questionBody + '\n');
    }
  };

  return (
    <div className="ask-question">
      <div className="ask-ques-container">
        <h1>Ask a public Question</h1>
        
        {subscription && (
          <div className="subscription-status-banner">
            <div className="plan-info">
              <span className="plan-label">Current Plan:</span>
              <span className="plan-name">{subscription.currentPlan.name}</span>
            </div>
            <div className="questions-info">
              <span className="questions-label">Questions Remaining Today:</span>
              <span className="questions-count">
                {subscription.currentPlan.id === 'gold' || subscription.questionsRemaining === 'Unlimited'
                  ? 'Unlimited'
                  : subscription.questionsRemaining}
              </span>
            </div>
            {subscription.currentPlan.id !== 'gold' && subscription.questionsRemaining !== 'Unlimited' && (
              <a href="/subscription/plans" className="upgrade-link">
                Upgrade Plan
              </a>
            )}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="ask-form-container">
            <label htmlFor="ask-ques-title">
              <h4>Title</h4>
              <p>Be specific and imagine you're asking a question to another person</p>
              <input
                type="text"
                id="ask-ques-title"
                onChange={(e) => {
                  setQuestionTitle(e.target.value);
                }}
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
              />
            </label>
            <label htmlFor="ask-ques-body">
              <h4>Body</h4>
              <p>Include all the information someone would need to answer your question</p>
              <textarea
                name=""
                id="ask-ques-body"
                onChange={(e) => {
                  setQuestionBody(e.target.value);
                }}
                cols="30"
                rows="10"
                onKeyPress={handleEnter}
              ></textarea>
            </label>
            <label htmlFor="ask-ques-tags">
              <h4>Tags</h4>
              <p>Add up to 5 tags to describe what your question is about</p>
              <input
                type="text"
                id="ask-ques-tags"
                onChange={(e) => {
                  setQuestionTags(e.target.value.split(' '));
                }}
                placeholder="e.g. (xml typescript wordpress)"
              />
            </label>
          </div>
          <input
            type="submit"
            value="Review your question"
            className="review-btn"
            disabled={!checkCanPostQuestion()}
          />
        </form>
      </div>
    </div>
  );
};

export default Askquestion;