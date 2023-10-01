// frontend/src/components/ReviewFormModal/index.js
import { useDispatch } from "react-redux";
import { useState } from "react";

import { useModal } from "../../context/Modal";
import { thunkCREATEReview } from "../../store/reviews";
import StarRatingInput from "../StarRatingInput";

function ReviewFormModal({spotId, userId}) {
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState("");
    const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("calling create review thunk, spotI, userId, review, stars", spotId, userId, review, stars)
    await dispatch(thunkCREATEReview({
      spotId,
      userId,
      review,
      stars,
    }))
    closeModal();
  };

  const handleChange = n => setStars(parseInt(n));

  return (
      <form className="createReviewForm" onSubmit={handleSubmit}>
        <h1>How was your stay?</h1>
        <textarea className="createReviewTextarea"
        value={review} onChange={e=>setReview(e.target.value)} placeholder="Leave your review here..." />
        <StarRatingInput
          disabled={false}
          onChange={handleChange}
          rating={stars}
        />
        <div className="createReviewFormButtonDiv">
          <button className="createReviewButton" disabled={review.length < 10 || !stars}>Submit Your Review</button>
        </div>
      </form>
  );
}

export default ReviewFormModal;
