// frontend/src/components/SpotDeleteFormModal/index.js
import { useDispatch } from "react-redux";
import { useState } from "react";

import { thunkDeleteSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";

function SpotDeleteFormModal({ id }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState({});

  const spotYesDelete = async (e) => {
    e.preventDefault();
    const response = await dispatch(thunkDeleteSpot(id))
    if (response.errors) setErrors(response)
    else closeModal();
  };

  return (
      <div className="confirmResourceDeleteModalDiv" >
        <h2>Confirm Delete</h2>
        <p ckassName="confirmResourceDeleteModalP" >Are you sure you want to remove this spot?</p>
        <p className="errors">{errors.errors ? errors.errors : ""}</p>
        <div className="resourceDeleteFormButtonDiv">
            <button className="resourceDeleteButton" type="button" onClick={spotYesDelete}>Yes (Delete Spot)</button>
            <button className="resourceNoDeleteButton" type="button" onClick={closeModal}>No (Keep Spot)</button>
        </div>
      </div>
  );
}

export default SpotDeleteFormModal;
