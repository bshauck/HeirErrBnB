// frontend/src/components/SpotDeleteFormModal/index.js
import ResourceDeleteFormModal from "../ResourceDeleteFormModal";
import { thunkDeleteSpot } from "../../store/spots";

function SpotDeleteFormModal({ id }) {
  return <ResourceDeleteFormModal id={id} resource="spot" thunkDeleteFunc={thunkDeleteSpot} />
}

export default SpotDeleteFormModal;
