// frontend/src/components/SpotDeleteFormModal/index.js
import { useDispatch } from "react-redux";
// import { useHistory } from "react-router-dom";

import { thunkDELETESpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
import "./SpotDelete.css";

function SpotDeleteFormModal({ id }) {
  console.log("🚀 ~ file: index.js:10 ~ SpotDeleteFormModal ~ id:", id)
  const dispatch = useDispatch();
  //   const history = useHistory();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    return dispatch(thunkDELETESpot(id))
      .then(closeModal)
      .catch(async (res) => {
        console.log("🚀 ~ file: index.js:20 ~ handleSubmit ~ res:", res)
        // const data = await res.json();
        // if (data && data.errors) {
        //     throw new Error(data.errors)
       /* } else history.push("/") */
    });
  };

  return (
      <form onSubmit={handleSubmit}>
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to remove this spot?</p>
        <div className="spotDeleteFormButtonDiv">
            <button className="spotDeleteButton" type="submit">Yes (Delete Spot)</button>
            <button className="spotNoDeleteButton" type="button" onClick={closeModal}>No (Keep Spot)</button>
        </div>
      </form>
  );
}

export default SpotDeleteFormModal;
