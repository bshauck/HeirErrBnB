// frontend/src/components/SpotDefailReviewArea/index.js

import { useDispatch, useSelector } from "react-redux"

import ReviewList from "../ReviewList"
import { thunkREADAllReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import ReviewFormModal from "../ReviewFormModal";
import StarRating from "../StarRating";
import { useEffect } from "react";


/* check logged in user, and all reviews doesn't include his
* and he isn't owner of the spot, then put a Post Your Review
* button; so have to get reviewsBySpot
*/
function SpotDetailReviewArea({ detailedSpot }) {
    const user = useSelector(state => state.session.user);
    const reviews = useSelector(state => state.reviews.spot);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkREADAllReviews(detailedSpot.id));
    }, [dispatch, detailedSpot.id])

    function handlePostClick() {

    }

    if (detailedSpot.numReviews && !Object.keys(reviews).length) {
        async function readAllSpotReview(id = detailedSpot.id) {
            await dispatch(thunkREADAllReviews(id));
        };
        readAllSpotReview(detailedSpot.id);
        return null;
    }

    const reviewArray = Object.values(reviews)
    console.log("🚀 ~ file: index.js:39 ~ SpotDetailReviewArea ~ reviewArray:", reviewArray)
    const hasReviewed = reviewArray.find(r => r.userId === user?.id) || user === null;
    console.log("🚀 ~ file: index.js:41 ~ SpotDetailReviewArea ~ hasReviewed:", hasReviewed)
    const isPostable = user?.id !== detailedSpot.ownerId && !hasReviewed;
    console.log("🚀 ~ file: index.js:43 ~ SpotDetailReviewArea ~ ownerId:", detailedSpot.ownerId)
    console.log("🚀 ~ file: index.js:43 ~ SpotDetailReviewArea ~ userid:", user)
    console.log("🚀 ~ file: index.js:43 ~ SpotDetailReviewArea ~ isPostable:", isPostable)
    const isPostableNoReviews = isPostable && !reviewArray.length;
    console.log("🚀 ~ file: index.js:45 ~ SpotDetailReviewArea ~ isPostableNoReviews:", isPostableNoReviews)

    return (
      <div className="spotDetailReviewAreaDiv">
        <div className="reviewListStarRatingHeaderDiv"><StarRating avgRating={detailedSpot.avgRating} numReviews={detailedSpot.numReviews} /></div>
        {isPostable &&
          <OpenModalButton
            buttonText="Post Your Review"
            onButtonClick={handlePostClick}
            modalComponent={<ReviewFormModal />}
          />}
        {isPostableNoReviews &&
            <div className="beTheFirstDiv">Be the first to post a review!</div>}
        <ReviewList reviews={reviews} spot={detailedSpot} />
      </div>
    )
}


export default SpotDetailReviewArea ;
