// frontend/src/components/ReviewList/index.js
import { useSelector } from 'react-redux';

import ReviewTile from '../ReviewTile';

function ReviewList({ spot }) {
    let reviewIds = useSelector(state => state.reviews.spotLatest[spot.id]);

    // ok to have 0 reviews; may be new, etc.
    if (spot.numReviews === 0) reviewIds = [];

    return (
      <>
      {reviewIds.map(reviewId =>
        (
        <ReviewTile key={reviewId} reviewId={reviewId} />
      ))}
      </>
    );
}


export default ReviewList ;
