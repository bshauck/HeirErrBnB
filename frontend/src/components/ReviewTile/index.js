import OpenModalButton from "../OpenModalButton";


function ReviewTile({ review, user }) {


  function handleDeleteClick() {

  }

/* TODO format date
date.toLocaleDateString("en-US", {
  month: "long",
  year: "numeric"
}); */

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
    {review.userId === user.id && <OpenModalButton
      buttonText="Delete"
      onButtonClick={handleDeleteClick}
      // onModalClose={??}
      modalComponent={<reviewDeleteModal id={review.id}/>}
    />}
    </div>
  )
};

  export default ReviewTile ;
