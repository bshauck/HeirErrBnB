// frontend/src/components/SpotDefailReviewArea/index.js

import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";

import ReviewList from "../ReviewList"
import { thunkREADAllReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import ReviewFormModal from "../ReviewCreateModal";
import StarRating from "../StarRating";


/* check logged in user, and all reviews doesn't include his
* and he isn't owner of the spot, then put a Post Your Review
* button; so have to get reviewsBySpot
*/
function SpotDetailReviewArea({ spot }) {
    const user = useSelector(state => state.session.user);
    const reviews = useSelector(state => state.reviews.spot)
    const dispatch = useDispatch();

    function handlePostClick() {

    }

    // if (!spot) {
        // await dispatch(thunkREADAllReviews(spot.id));

        //     return null;
        // }

        useEffect(() => {
            async function readAllSpotReview() {
                await dispatch(thunkREADAllReviews(spot.id));
            };
            if (!reviews) readAllSpotReview();
    }, [spot, spot.id, reviews, dispatch])

    if (!user || !reviews) return null;
    const reviewArray = Object.values(reviews)
    const hasReviewed = undefined !== reviewArray.find(r => r.userId === user.id);
    const isPostable = user.id !== spot.ownerId && !hasReviewed;
    const isPostableNoReviews = isPostable && !reviewArray.length;

    return null && (
      <div className="spotDetailReviewAreaDiv">
        <div className="reviewListStarRatingHeaderDiv"><StarRating avgRating={spot.avgRating} numReviews={spot.numReviews} /></div>
        {isPostable &&
          <OpenModalButton
            buttonText="Post Your Review"
            onButtonClick={handlePostClick}
            modalComponent={<ReviewFormModal />}
          />}
        {isPostableNoReviews &&
            <p className="beTheFirstP">Be the first to post a review!</p>}
        <ReviewList reviews={reviews} spot={spot} />
      </div>
    )
}


export default SpotDetailReviewArea ;
