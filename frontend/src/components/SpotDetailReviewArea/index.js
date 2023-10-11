// frontend/src/components/SpotDetailReviewArea/index.js
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux"

import { thunkReadAllReviews, thunkReadAllUserReviews } from "../../store/reviews";
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
    const reviews = useSelector(state => state.reviews[detailedSpot.id]);
    const dispatch = useDispatch();


    function handlePostClick() {

    }
    /* here, user may have its user.reviews id list, and
    reviews may have the ordered list of reviews for the
    spot (newest first). Make sure these are both filled
    in so you can determine (1) if ANY reviews exist for
    the spot, and (2) if so, does the user have one */

    const spotRef = useRef([]); /* avoid resubmitting request */
    const userRef = useRef([]);
    const num = detailedSpot.numReviews;
    console.log("🚀 ~ SpotDetailReviewArea ~ detailedSpot:", detailedSpot)
    if (!num && num !== 0) { /* need to read spot reviews */
        if (!spotRef.current[detailedSpot.id])  // first request
          spotRef.current[detailedSpot.id] = dispatch(thunkReadAllReviews(detailedSpot))
        return null; // no details yet; but need them
    } else if (spotRef.current[detailedSpot.id]) // fulfilled; remove
        delete spotRef.current[detailedSpot.id]
    if (num !== 0 && !Array.isArray(user.reviews)) { /* need user reviews */
      if (!userRef.current[user.id]) // first request
        userRef.current[user.id] = dispatch(thunkReadAllUserReviews())
        return null;
      }

      console.log("🚀 ~ file: index.js:43 ~ SpotDetailReviewArea ~ user:", user)


    let isPostable = user?.id !== detailedSpot.ownerId
    let isPostableNoReviews = false;
    if (!reviews || !reviews.length || !Object.values(reviews).length) {
      const reviewArray = Object.values(reviews)
      const hasReviewed = reviewArray.find(r => r.userId === user?.id) || user === null;
      isPostable = isPostable && !hasReviewed;
      isPostableNoReviews = isPostable && !reviewArray.length;
    }


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
