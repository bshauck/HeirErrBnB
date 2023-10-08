// frontend/src/components/ReviewFormModal/index.js
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { useModal } from "../../context/Modal";
import { thunkCreateReview } from "../../store/reviews";
import StarRatingInput from "../StarRatingInput";
import { thunkReadSpot } from "../../store/spots";

function ReviewFormModal({spot, userId}) {
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState("");
    const { closeModal } = useModal();
    const spotId = spot.id;
    const user=useSelector(state => state.session.user)

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(thunkCreateReview({
      spotId,
      userId,
      review,
      stars,
    }, user.firstName))
    dispatch(thunkReadSpot(spotId))
    closeModal();
  };

  const handleChange = n => setStars(parseInt(n));

  return (
      <form className="createReviewForm" onSubmit={handleSubmit}>
        <h1>How was your stay?</h1>
        <textarea className="createReviewTextarea"
        value={review} onChange={e => setReview(e.target.value)} placeholder="Leave your review here..." />
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
