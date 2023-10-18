// frontend/src/components/SpotDetailReviewArea/index.js
import { useEffect, useState } from "react";
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
    const userReviews = useSelector(state => state.session.reviews);
    const spotReviews = useSelector(state => state.spots.id[spot.id].reviews);
    const orderedReviews = useSelector(state => state.reviews.spotLatest[spot.id])
    const dispatch = useDispatch();
    console.log("userRevlen,spotRevlen,orderedLen; ", userReviews?.length, spotReviews?.length, orderedReviews?.length);
    let mayPost = false;
    let mayPostNoReviews = false;

    useEffect(()=>{
      if (!orderedReviews)
      dispatch(thunkReadAllReviews(spot.id))
    }, [dispatch,orderedReviews,spot.id]);

    function handlePostClick() {}
    /* here, user may have its userReviews id list, and
    reviews may have the ordered list of reviews for the
    spot (newest first). Make sure these are both filled
    in so you can determine (1) if ANY reviews exist for
    the spot, and (2) if so, does the user have one */

    const [userRef] = useState({current:{}});
    const [reviewRef] = useState({current:{}});

    if (!orderedReviews || !spotReviews) {
      if (!reviewRef.current[spot.id])
        reviewRef.current[spot.id] = dispatch(thunkReadAllReviews(spot.id))
      return null;
    } else if (Array.isArray(spotReviews))
    if (reviewRef.current[spot.id]) delete reviewRef.current[spot.id]

    if (user) {
      if (user.id !== spot.ownerId) {
      if (spotReviews.length && !Array.isArray(user.reviews)) { /* need user reviews */
        if (!userRef.current[user.id]) // first request
          userRef.current[user.id] = dispatch(thunkReadAllUserReviews())
        return null;
      } else if (Array.isArray(user.reviews))
        if (userRef.current[user.id]) delete userRef.current[user.id]

      console.log("🚀 ~ SpotDetailReviewArea ~ user:", user)
      console.log("🚀 ~ SpotDetailReviewArea ~ spot:", spot)
      console.log("reviews: user, spot", userReviews, spotReviews)


        console.log("userrevs", userReviews)
        console.log("spotrevs", spotReviews)
        mayPost = !spotReviews.length || !userReviews || !userReviews.length || userReviews.every(urev => !spotReviews.includes(urev));
        mayPostNoReviews = mayPost && !spotReviews.length;
    }}
    console.log("🚀 ~  mayPost, noReviews:", mayPost, mayPostNoReviews)

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
