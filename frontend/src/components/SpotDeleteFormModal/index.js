// frontend/src/components/SpotDeleteFormModal/index.js
import { useDispatch } from "react-redux";

import { thunkDeleteSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";

function SpotDeleteFormModal({ id }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const spotYesDelete = async (e) => {
    e.preventDefault();
    await dispatch(thunkDeleteSpot(id))
    closeModal();
  };

  return (
      <div className="confirmSpotDeleteModalDiv" >
        <h2 className="confirmDeleteHeading">Confirm Delete</h2>
        <p ckassName="confirmSpotDeleteModalP" >Are you sure you want to remove this spot?</p>
        <div className="spotDeleteFormButtonDiv">
            <button className="spotDeleteButton" type="button" onClick={spotYesDelete}>Yes (Delete Spot)</button>
            <button className="spotNoDeleteButton" type="button" onClick={closeModal}>No (Keep Spot)</button>
        </div>
      </div>
  );
}

export default SpotDeleteFormModal;
