// frontend/src/components/ReviewList/index.js
import { useSelector } from 'react-redux';

import ReviewTile from '../ReviewTile';

function ReviewList({ spot }) {
    const reviews = useSelector(state => state.reviews.spotLatest[spot.id]);
    const user = useSelector(state => state.session.user);

    // ok to have 0 reviews; may be new, etc.

    /* reviews already sorted by updatedAt */

    return (
      <>
      {reviews.map(reviewId =>
        (
        <ReviewTile key={reviewId} reviewId={reviewId} user={user} />
      ))}
      </>
    );
}


export default ReviewList ;
