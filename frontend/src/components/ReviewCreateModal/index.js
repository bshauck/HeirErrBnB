// frontend/src/components/ReviewFormModal/index.js
// import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import { thunkCREATEReview } from "../../store/reviews";

function ReviewFormModal() {
    const dispatch = useDispatch();
    // const [review, setReview] = useState("");
    // const [stars, setStars] = useState("");
    // const [errors, setErrors] = useState({});
    const { closeModal } = useModal();


  const spotYesDelete = async (e) => {
    e.preventDefault();
    await dispatch(thunkCREATEReview())
    closeModal();
  };

  return (
      <>
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to remove this spot?</p>
        <div className="spotDeleteFormButtonDiv">
            <button className="spotDeleteButton" type="button" onClick={spotYesDelete}>Yes (Delete Spot)</button>
            <button className="spotNoDeleteButton" type="button" onClick={closeModal}>No (Keep Spot)</button>
        </div>
      </>
  );
}

export default ReviewFormModal;
