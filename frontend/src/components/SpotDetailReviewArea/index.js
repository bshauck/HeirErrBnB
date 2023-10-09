// frontend/src/components/SpotDetailReviewArea/index.js
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux"

import { thunkReadAllReviews } from "../../store/reviews";
import ReviewList from "../ReviewList"
import OpenModalButton from "../OpenModalButton";
import ReviewFormModal from "../ReviewFormModal";
import StarRating from "../StarRating";

/* check logged in user, and all reviews doesn't include his
* and he isn't owner of the spot, then put a Post Your Review
* button; so have to get reviewsBySpot
*/
function SpotDetailReviewArea({ detailedSpot }) {
    const user = useSelector(state => state.session.user);
    const reviews = useSelector(state => state.reviews.spot);
    const dispatch = useDispatch();


    function handlePostClick() {

    }

    const ref = useRef([]); /* ensure only one outstanding request */
    if (detailedSpot.numReviews && !Object.keys(reviews).length) {
      if (!detailedSpot.reviews) { // missing inner details
        if (!ref.current[detailedSpot.id])  // first request
          ref.current[detailedSpot.id] = dispatch(thunkReadAllReviews(detailedSpot))
        return null; // no details yet; but need them
      } else if (ref.current[detailedSpot.id]) // fulfilled; remove
        delete ref.current[detailedSpot.id]
    }

    const reviewArray = Object.values(reviews)
    const hasReviewed = reviewArray.find(r => r.userId === user?.id) || user === null;
    const isPostable = user?.id !== detailedSpot.ownerId && !hasReviewed;
    const isPostableNoReviews = isPostable && !reviewArray.length;
    return (
      <div className="spotDetailReviewAreaDiv">
        <div className="reviewListStarRatingHeaderDiv"><StarRating avgRating={detailedSpot.avgRating} numReviews={detailedSpot.numReviews} /></div>
        {isPostable &&
          <OpenModalButton
            buttonText="Post Your Review"
            onButtonClick={handlePostClick}
            modalComponent={<ReviewFormModal spot={detailedSpot} userId={user.id} />}
          />}
        {isPostableNoReviews &&
            <div className="beTheFirstDiv">Be the first to post a review!</div>}
        <ReviewList reviews={reviews} spot={detailedSpot}  />
      </div>
    )
}


export default SpotDetailReviewArea ;
