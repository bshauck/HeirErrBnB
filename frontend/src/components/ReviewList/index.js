// frontend/src/components/ReviewList/index.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ReviewTile from '../ReviewTile';
import { thunkReadAllReviews } from '../../store/reviews';

function ReviewList({ spot }) {
    let reviewIds = useSelector(state => state.reviews.spotLatest[spot.id]);
    const ref = useRef({});
    const dispatch = useDispatch()

    useEffect(()=>{
      if (!reviewIds) {
          if (!ref.current[spot.id])
            ref.current[spot.id] = dispatch(thunkReadAllReviews(spot.id))
          return;
      } else if (ref.current[spot.id]) delete ref.current[spot.id]
    }, [reviewIds, dispatch, spot.id])

    // ok to have 0 reviews; may be new, etc.
    if (!Array.isArray(reviewIds)) {
      console.log("reviewIds should be an empty array if no reviews if not empty, then ordered by descending updatedAt timestamp or undefined if never determined from db; spot.numReviews, typeof reviewIds: ", spot.numReviews, typeof reviewIds);
      return null
    }
    if (reviewIds.includes(null) || reviewIds.includes(undefined)) {
      console.log("baaad review id; ", reviewIds)
      return null
    }

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
