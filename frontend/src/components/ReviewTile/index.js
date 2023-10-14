// frontend/src/components/ReviewTile/index.js
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import ReviewDeleteFormModal from "../ReviewDeleteFormModal";


function ReviewTile({ reviewId }) {
  const review = useSelector(state => state.reviews.id[reviewId])
  const user = useSelector(state => state.session.user)

  if (!review) return null;
  else console.log("🚀 ~ ReviewTile ~ review:", review)

function handleDeleteClick() {}

return (
    <div className="reviewTileDiv">

    <div className="tileNameDateDiv">
      <div className="tileFirstNameDiv">{review.firstName}</div>
      <div className="tileMonthYearDiv">{(new Date(review.updatedAt)).toLocaleDateString("en-US", {
  month: "long",
  year: "numeric"
})}</div>
    </div>
    <div className="tileReviewTextDiv" >{review.commentary}</div>
    {user && review.userId === user.id && <OpenModalButton
      buttonText="Delete"
      className="deleteReviewButton"
      onButtonClick={handleDeleteClick}
      // onModalClose={??}
      modalComponent={<ReviewDeleteFormModal id={review.id} spotId={review.spotId}/>}
    />}
    </div>
  )
};

  export default ReviewTile ;
