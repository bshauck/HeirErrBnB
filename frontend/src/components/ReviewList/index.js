// frontend/src/components/ReviewList/index.js
import { /*useEffect, useRef*/  useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import ReviewTile from '../ReviewTile';
import { thunkReadSpotReviews } from '../../store/reviews';

function ReviewList({ reviews, spot }) {
    const { id } = useParams();
    const spotId = spot.id || id;
    let reviewIds = useSelector(state => state.reviews.spotLatest[spotId]);
    const dispatch = useDispatch()


    const ref = useState({current:{}});
    if (!reviewIds) {
      if (!ref.current[spotId]) ref.current[spotId] = dispatch(thunkReadSpotReviews(spotId))
      return null;
  } else if (ref.current && ref.current[spotId]) delete ref.current[spotId]


    // ok to have 0 reviews; may be new, etc.
    if (!Array.isArray(reviewIds)) {
      if (Array.isArray(reviews)) reviewIds = reviews.map(r=>r.id)
      else return null
    }

    return (
      <div className="reviewListDiv" >
      {reviewIds.map(reviewId =>
        (
        <ReviewTile key={reviewId} reviewId={reviewId} />
      ))}
      </div>
    );
}


export default ReviewList ;
