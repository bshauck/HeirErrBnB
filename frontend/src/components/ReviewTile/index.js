import OpenModalButton from "../OpenModalButton";


function ReviewTile({ review, user }) {


  function handleDeleteClick() {

  }

/* TODO format date*/
return (
    <div className="reviewTileDiv">

    <div className="tileNameDateDiv">
      <div className="tileFirstNameDiv">{review.User.firstName}</div>
      <div className="tileMonthYearDiv">{review.updatedAt}</div>
    </div>
    <div className="tileReviewTextDiv" >{review.review}</div>
    <div className="tilePriceDiv">${review.price}</div>
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
