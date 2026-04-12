import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const FeedbackForm = ({ onSubmit, onCancel, recipeId }) => {
  const { currentUser } = useAuth();
  const [feedback, setFeedback] = useState({
    rating: 5,
    comment: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to submit feedback');
      return;
    }

    const feedbackData = {
      ...feedback,
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email,
      email: currentUser.email,
      recipeId: recipeId
    };

    onSubmit(feedbackData);
    setFeedback({ rating: 5, comment: '' });
  };

  return (
    <div className="feedback-form">
      <h3>Add Your Feedback</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rating</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${feedback.rating >= star ? 'active' : ''}`}
                onClick={() => setFeedback({...feedback, rating: star})}
              >
                ⭐
              </button>
            ))}
            <span className="rating-text">{feedback.rating}/5</span>
          </div>
        </div>
        
        <div className="form-group">
          <label>Comment</label>
          <textarea 
            value={feedback.comment}
            onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
            placeholder="Share your experience with this recipe..."
            rows="4"
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Submit Feedback
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;