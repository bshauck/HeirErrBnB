// frontend/src/components/ReviewDeleteFormModal/index.js

import ResourceDeleteFormModal from "../ResourceDeleteFormModal";
import { thunkDeleteReview } from "../../store/reviews";

function ReviewDeleteFormModal({ id, spotId }) {
  return <ResourceDeleteFormModal id={{id,spotId}} resource="review" thunkDeleteFunc={thunkDeleteReview} />
}

export default ReviewDeleteFormModal;
