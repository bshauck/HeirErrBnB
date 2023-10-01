// frontend/src/components/ReviewList/index.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { thunkREADAllReviews } from '../../store/reviews';
import ReviewTile from '../ReviewTile';

function ReviewList({ spotId }) {
    const reviews = useSelector(state => state.reviews.spot);
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!reviews) dispatch(thunkREADAllReviews(spotId))
    }, [spotId, reviews, dispatch])

    if (!user || !reviews || !reviews.length) return null;

    return (
      <>
      {reviews.map(review =>
        (
        <ReviewTile key={review.id} review={review} user={user} />
      ))}
      </>
    );
}


export default ReviewList ;
