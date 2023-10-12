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
function SpotDetailReviewArea({ spot }) {
  console.log("Starting render for review area on spot: ", spot.id)
    const user = useSelector(state => state.session.user);
    const userReviews = useSelector(state => state.session.user.reviews);
    const spotReviews = useSelector(state => state.spots.id[spot.id].reviews);
    const orderedReviews = useSelector(state => state.reviews.spotLatest[spot.id])
    const dispatch = useDispatch();
    console.log("userRevlen,spotRevlen,orderedLen; ", userReviews?.length, spotReviews?.length, orderedReviews?.length);

    function handlePostClick() {}
    /* here, user may have its user.reviews id list, and
    reviews may have the ordered list of reviews for the
    spot (newest first). Make sure these are both filled
    in so you can determine (1) if ANY reviews exist for
    the spot, and (2) if so, does the user have one */

    const userRef = useRef({});
    const reviewRef = useRef({});

    if (!orderedReviews) {
      if (!reviewRef.current[spot.id])
        reviewRef.current[spot.id] = dispatch(thunkReadAllReviews(spot.id))
      return null;
    } else if (Array.isArray(orderedReviews))
      if (reviewRef.current[spot.id]) delete reviewRef.current[spot.id]

    const sReviews = spot.reviews;

    if (sReviews.length && !Array.isArray(user?.reviews)) { /* need user reviews */
      if (!userRef.current[user.id]) // first request
        userRef.current[user.id] = dispatch(thunkReadAllUserReviews())
      return null;
    } else if (Array.isArray(user.reviews))
      if (userRef.current[user.id]) delete userRef.current[user.id]


    // console.log("🚀 ~ SpotDetailReviewArea ~ user:", user)
    // console.log("🚀 ~ SpotDetailReviewArea ~ spot:", spot)
    // console.log("🚀 ~ SpotDetailReviewArea ~ reviews:", reviews)

    console.log("reviews: user, spot", user.reviews, spot.reviews)


    // let isPostable = user.id !== spot.ownerId
    // let isPostableNoReviews = false;
    if (!orderedReviews || !orderedReviews.length) console.log("ERROR: orderedReviews", orderedReviews)
    const hasReviewed = user === null || Object.values(orderedReviews).find(r => r.userId === user.id);
    console.log("🚀 ~ SpotDetailReviewArea ~ hasReviewed:", hasReviewed)
    const mayPost =  !hasReviewed && user.id !== spot.ownerId;
    console.log("🚀 ~ SpotDetailReviewArea ~ mayPost:", mayPost)
    const mayPostNoReviews = mayPost && !orderedReviews.length;
    console.log("🚀 ~ SpotDetailReviewArea ~ mayPostNoReviews:", mayPostNoReviews)


    return (
      <div className="spotDetailReviewAreaDiv">
        <div className="reviewListStarRatingHeaderDiv"><StarRating avgRating={spot.avgRating} numReviews={spot.numReviews} /></div>
        {mayPost &&
          <OpenModalButton
            buttonText="Post Your Review"
            onButtonClick={handlePostClick}
            modalComponent={<ReviewFormModal spot={spot} userId={user.id} />}
          />}
        {mayPostNoReviews &&
            <div className="beTheFirstDiv">Be the first to post a review!</div>}
        <ReviewList reviews={orderedReviews} spot={spot}  />
      </div>
    )
}

export default SpotDetailReviewArea ;
