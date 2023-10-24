// frontend/src/components/ResourceDeleteFormModal/index.js

import { useDispatch } from "react-redux";
import { useState } from "react";
import { useModal } from "../../context/Modal";

  /* For reuse: need resource id for thunk invocation,
     lowercase resource name (spot, review, booking) and
     deletion thunk */
function ResourceDeleteFormModal({ id, resource, thunkDeleteFunc }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState({});
  const capitalized = resource[0].toUpperCase() + resource.slice(1)

  const resouceYesDelete = async (e) => {
    e.preventDefault();
    const response = await dispatch(thunkDeleteFunc(id))
    console.log("🚀 ~ resouceYesDelete ~ response:", response)
    if (response.errors) setErrors(response)
    else closeModal();
  };

  return (
      <div className="confirmResourceDeleteModalDiv" >
        <h2>Confirm Delete</h2>
        <ul className="errors">{errors.errors ? (Object.keys(errors.errors).map(k => (
          <li key={k}>{`${k}: ${errors.errors[k]}`}</li>))) : ""}</ul>
        <p className="confirmResourceDeleteModalP" >Are you sure you want to remove this {resource}?</p>
        <div className="resourceDeleteFormButtonDiv">
            <button className="resourceDeleteButton" type="button" onClick={resouceYesDelete}>Yes (Delete {capitalized})</button>
            <button className="resourceNoDeleteButton" type="button" onClick={closeModal}>No (Keep {capitalized})</button>
        </div>
      </div>
  );
}

export default ResourceDeleteFormModal;
