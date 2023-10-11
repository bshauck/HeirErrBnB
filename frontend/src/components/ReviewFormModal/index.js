// frontend/src/components/ReviewFormModal/index.js
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { useModal } from "../../context/Modal";
import { thunkCreateReview } from "../../store/reviews";
import StarRatingInput from "../StarRatingInput";
import { thunkReadSpot } from "../../store/spots";

function ReviewFormModal({spot, userId}) {
    const dispatch = useDispatch();
    const [commentary, setCommentary] = useState("");
    const [stars, setStars] = useState("");
    const { closeModal } = useModal();
    const spotId = spot.id;
    const user=useSelector(state => state.session.user)

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(thunkCreateReview({
      spotId,
      userId,
      commentary,
      stars,
    }, user.firstName))
    dispatch(thunkReadSpot(spotId)) // unsure this is the place
    closeModal();
  };

  const handleChange = n => setStars(parseInt(n));

  return (
      <form className="createReviewForm" onSubmit={handleSubmit}>
        <h1>How was your stay?</h1>
        <textarea className="createReviewTextarea"
        value={commentary} onChange={e => setCommentary(e.target.value)} placeholder="Leave your review here..." />
        <StarRatingInput
          disabled={false}
          onChange={handleChange}
          rating={stars}
        />
        <div className="createReviewFormButtonDiv">
          <button className="createReviewButton" disabled={commentary.length < 10 || !stars}>Submit Your Review</button>
        </div>
      </form>
  );
}

export default ReviewFormModal;
