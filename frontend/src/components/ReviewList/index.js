// frontend/src/components/ReviewList/index.js
import { useDispatch, useSelector } from 'react-redux';

import { thunkREADAllReviews } from '../../store/reviews';
import ReviewTile from '../ReviewTile';

function ReviewList({ spot }) {
    const reviews = useSelector(state => state.reviews.spot);
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    if (!reviews) {
      async function getTheDarnReviews() {
        await dispatch(thunkREADAllReviews(spot.id))
      }
      getTheDarnReviews();
      return null;
    }

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
