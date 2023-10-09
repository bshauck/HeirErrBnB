// frontend/src/components/ReviewList/index.js
import { useSelector } from 'react-redux';

import ReviewTile from '../ReviewTile';

function ReviewList({ spot }) {
    const reviews = useSelector(state => state.reviews.spot);
    const user = useSelector(state => state.session.user);

    // ok to have 0 reviews; may be new, etc.

    /* sort reviews by updatedAt date*/
    let arr = Object.values(reviews);
    arr.sort((a,b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))

    return (
      <>
      {arr.map(review =>
        (
        <ReviewTile key={review.id} review={review} user={user} />
      ))}
      </>
    );
}


export default ReviewList ;
