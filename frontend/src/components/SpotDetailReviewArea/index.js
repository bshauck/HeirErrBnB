// frontend/src/components/SpotDetailReviewArea/index.js
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"

import { thunkReadSpotReviews, thunkReadAllUserReviews } from "../../store/reviews";
import ReviewList from "../ReviewList"
import OpenModalButton from "../OpenModalButton";
import ReviewFormModal from "../ReviewFormModal";
import StarRating from "../StarRating";


function SpotDetailReviewArea({ spot }) {
    const user = useSelector(state => state.session.user);
    const userReviews = useSelector(state => state.session.reviews);
    const spotReviews = useSelector(state => state.spots.id[spot.id].reviews);
    const orderedReviews = useSelector(state => state.reviews.spotLatest[spot.id])
    const dispatch = useDispatch();
    let mayPost = false;
    let mayPostNoReviews = false;


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
        reviewRef.current[spot.id] = dispatch(thunkReadSpotReviews(spot.id))
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


        mayPost = !spotReviews.length || !userReviews || !userReviews.length || userReviews.every(urev => !spotReviews.includes(urev));
        mayPostNoReviews = mayPost && !spotReviews.length;
    }}

    return (
      <div className="spotDetailReviewAreaDiv">
        <div className="reviewListStarRatingHeaderDiv"><StarRating className="reviewListStarRating" avgRating={spot.avgRating} numReviews={spot.numReviews} /></div>
        {mayPost &&
          <OpenModalButton
            buttonText="Post Your Review"
            onButtonClick={handlePostClick}
            modalComponent={<ReviewFormModal spot={spot} userId={user.id} />}
          />}
        {(mayPostNoReviews &&
            <div className="beTheFirstDiv">Be the first to post a review!</div>) ||
        <ReviewList reviews={orderedReviews} spot={spot}  />}
      </div>
    )
}

export default SpotDetailReviewArea ;
