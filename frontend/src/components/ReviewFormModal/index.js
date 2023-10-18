// frontend/src/components/ReviewFormModal/index.js
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { useModal } from "../../context/Modal";
import { thunkCreateReview } from "../../store/reviews";
import StarRatingInput from "../StarRatingInput";

function ReviewFormModal({spot, userId}) {
    const dispatch = useDispatch();
    const [commentary, setCommentary] = useState("");
    const [stars, setStars] = useState(0);
    const { closeModal } = useModal();
    const user = useSelector(state => state.session.user)
    const spotId = spot.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("create review; stars/nStars origStars type/Numbered type", stars, Number(stars), typeof stars, typeof Number(stars))
    await dispatch(thunkCreateReview({
      spotId,
      userId,
      commentary,
      stars,
    }, user.firstName))
    closeModal();
  };

  const handleChange = n => setStars(n);

  return (
      <form className="createReviewForm" onSubmit={handleSubmit}>
        <h2 className="createReviewH2">How was your stay?</h2>
        <textarea className="createReviewTextarea" autoFocus
        cols="40"
        rows="8"
        value={commentary} onChange={e => setCommentary(e.target.value)} placeholder="Leave your review here..." />
        <StarRatingInput className="createReviewStars"
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
