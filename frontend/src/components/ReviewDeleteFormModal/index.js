// frontend/src/components/ReviewDeleteFormModal/index.js
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { thunkDeleteReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { thunkReadSpot } from "../../store/spots";

function ReviewDeleteFormModal({ id }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState({});
  const revs = useSelector(state => state.reviews.spot)


  const reviewYesDelete = async (e) => {
    const response = await dispatch(thunkDeleteReview(id))
    dispatch(thunkReadSpot(revs[id].spotId))
    if (response.errors) setErrors(response)
    else closeModal();
  };

  return (
      <>
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to remove this review?</p>
        <p className="errors">{errors.errors ? errors.errors : ""}</p>
        <div className="reviewDeleteFormButtonDiv">
            <button className="reviewDeleteButton" type="button" onClick={reviewYesDelete}>Yes (Delete Review)</button>
            <button className="reviewNoDeleteButton" type="button" onClick={closeModal}>No (Keep Review)</button>
        </div>
      </>
  );
}

export default ReviewDeleteFormModal;
