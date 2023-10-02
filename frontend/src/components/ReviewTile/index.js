import OpenModalButton from "../OpenModalButton";
import ReviewDeleteFormModal from "../ReviewDeleteFormModal";


function ReviewTile({ review, user }) {


  function handleDeleteClick() {

  }

  if (!review) return null;

return (
    <div className="reviewTileDiv">

    <div className="tileNameDateDiv">
      <div className="tileFirstNameDiv">{review.User.firstName}</div>
      <div className="tileMonthYearDiv">{(new Date(review.updatedAt)).toLocaleDateString("en-US", {
  month: "long",
  year: "numeric"
})}</div>
    </div>
    <div className="tileReviewTextDiv" >{review.review}</div>
    {user && review.userId === user.id && <OpenModalButton
      buttonText="Delete"
      className="deleteReviewButton"
      onButtonClick={handleDeleteClick}
      // onModalClose={??}
      modalComponent={<ReviewDeleteFormModal id={review.id}/>}
    />}
    </div>
  )
};

  export default ReviewTile ;
