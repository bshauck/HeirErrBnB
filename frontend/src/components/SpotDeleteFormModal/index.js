// frontend/src/components/SpotDeleteFormModal/index.js
import { useDispatch } from "react-redux";

import { thunkDELETESpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
import "./SpotDelete.css";

function SpotDeleteFormModal({ id }) {
  console.log("🚀 ~ file: index.js:10 ~ SpotDeleteFormModal ~ id:", id)
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const spotYesDelete = async (e) => {
    e.preventDefault();
    await dispatch(thunkDELETESpot(id))
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

export default SpotDeleteFormModal;
