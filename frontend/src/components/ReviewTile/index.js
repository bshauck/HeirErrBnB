

function ReviewTile() {

return (
    <div className="reviewTileDiv">
    <img className="reviewTileImg" alt="preview" src={review.previewImage} onClick={handleTileClick}>
    {/* <img className="reviewTileImg" alt="preview" src="bar-image-unavailable.png" onClick={handleTileClick}> */}
    </img>
    <div className="tileLocationAndRatingDiv">
        <span className="tileLocation">{`${review.city}, ${review.state}`}</span>
        <StarRating avgRating={review.avgRating}/>
    </div>
    <div className="tilePriceDiv">${review.price}</div>
    {isManaged &&
    <div className="managedTileButtonDiv">
        <button type="button" onClick={handleUpdateClick}>Update</button>
        <OpenModalButton
              buttonText="Delete"
              onButtonClick={handleDeleteClick}
              // onModalClose={??}
              modalComponent={<reviewDeleteFormModal id={review.id}/>}
              />
    </div>
    }
    </div>
  );
}

  export default ReviewTile ;
