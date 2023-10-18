// frontend/src/components/ReviewDeleteFormModal/index.js
import { useDispatch } from "react-redux";
import { useState } from "react";

import { thunkDeleteReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";

function ReviewDeleteFormModal({ id, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState({});


  const reviewYesDelete = async (e) => {
    const response = await dispatch(thunkDeleteReview(id, spotId))
    if (response.errors) setErrors(response)
    else closeModal();
  };

  return (
    <div className="confirmResourceDeleteModalDiv" >
    <h2>Confirm Delete</h2>
        <p ckassName="confirmResourceDeleteModalP" >Are you sure you want to remove this review?</p>
        <p className="errors">{errors.errors ? errors.errors : ""}</p>
        <div className="resourceDeleteFormButtonDiv">
            <button className="resourceDeleteButton" type="button" onClick={reviewYesDelete}>Yes (Delete Review)</button>
            <button className="resourceNoDeleteButton" type="button" autoFocus onClick={closeModal}>No (Keep Review)</button>
        </div>
      </div>
  );
}

export default ReviewDeleteFormModal;
