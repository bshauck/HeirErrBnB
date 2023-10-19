/* reviews OLD slice of state
{
    spot: {
      [reviewId]: {
        reviewData,
        User: {
          userData,
        },
        ReviewImages: [imagesData],
      },
      optionalOrderedList: [],
    },
    user: {
      [reviewId]: {
        reviewData,
        User: {
          userData,
        },
        Spot: {
          reviewData,
        },
        ReviewImages: [imagesData],
      },
      optionalOrderedList: [],
    },

}
*/


/* NEW review state shape
{
  id:
    {
      [reviewId]:
        {
          id,
          userId,
          spotId,
          commentary, // renamed review column
          stars, // 1-5

          // additional details
          images: [reviewImageIds,]
        },
    }
  spotLatest: { [spotId]: [idsOrderedByDescUpdatedDate], }
}
*/

import { CREATED_REVIEW, DELETED_REVIEW, READ_SPOT_REVIEWS, READ_USER_REVIEWS, UPDATED_REVIEW, UPDATED_SPOT_REVIEW_RATINGS } from "./commonActionCreators";
import { fetchData } from "./csrf";

const READ_REVIEW = "reviews/READ_REVIEW";


export function readAllSpotReviews(reviews, spotId) {
  return {
      type: READ_SPOT_REVIEWS,
      payload: {reviews, spotId}
  }
}

function readAllUserReviews(reviews) {
    return {
        type: READ_USER_REVIEWS,
        payload: reviews
    }
}

function readReview(review) {
    return {
        type: READ_REVIEW,
        payload: review
    }
}

function deletedReview(reviewId, spotId) {
    return {
        type: DELETED_REVIEW,
        payload: {reviewId, spotId}
    };
};

function createdReview(review) {
    return {
        type: CREATED_REVIEW,
        payload: {review}
    };
};

function updatedReview(review) {
    return {
        type: UPDATED_REVIEW,
        payload: review
    }
}

/* cross-slice thunk helper */
function updatedSpotReviewRatings(state, spotId) {
  const [numReviews, avgRating] = calculateRatings(state, spotId)
    return {
        type: UPDATED_SPOT_REVIEW_RATINGS,
        payload: {spotId, numReviews, avgRating}
    }
}

export const thunkReadAllReviews = spotId => async dispatch => {
  const url = `/api/spots/${spotId}/reviews`
  const answer = await fetchData(url)
  if (!answer.errors) {
    dispatch(readAllSpotReviews(answer.Reviews, spotId))
  }
  return answer
}

export const thunkReadAllUserReviews = () => async dispatch => {
  const url = `/api/reviews/current`
  const answer = await fetchData(url)
  if (!answer.errors) dispatch(readAllUserReviews(answer.Reviews))
  return answer
}

export const thunkReadReview = id => async dispatch => {
  const url = `/api/reviews/${id}`
  const answer = await fetchData(url)
  if (!answer.errors) dispatch(readReview(answer))
  return answer
}

/* thunk helper */
const calculateRatings = (state, spotId) => {
  /* spotLatest is guaranteed to be in
   * proper order, with any newly created
   * reviewId inserted; or newly deleted
   * reviewId removed
   */
  /* return value is array with [num, avg] */
  const spotReviewIds = state.spotLatest[spotId];
  const numReviews = spotReviewIds.length;
  if (!numReviews) return [0, null];
  const ratings = spotReviewIds.map(rId => state.id[rId].stars)
  const sum = ratings.reduce((acc, next) => acc + next, 0)
  return [numReviews, sum/numReviews]
}

export const thunkDeleteReview = (id, spotId) => async (dispatch, getState) => {
  const answer = await fetchData(`/api/reviews/${id}`, {method: 'DELETE'})
  if (!answer.errors) {
    dispatch(deletedReview(id, spotId))
    dispatch(updatedSpotReviewRatings(getState().reviews, spotId))
  }
  return answer
}

export const thunkCreateReview = (review, firstName) => async (dispatch, getState) => {
  const url = `/api/spots/${review.spotId}/reviews`

  const options = {
    method: "POST",
    body: JSON.stringify(review)
  }
  const answer = await fetchData(url, options)
  if (!answer.errors) {
    answer.firstName = firstName
    dispatch(createdReview(answer, answer.spotId))
    dispatch(updatedSpotReviewRatings(getState().reviews, answer.spotId))
  }
  return answer
}

export const thunkUpdateReview = review => async (dispatch, getState) => {
  const url = `/api/reviews/${review.id}`
  const options = {
    method: "PUT",
    body: JSON.stringify(review)
  }
  const answer = await fetchData(url, options)
  if (!answer.errors) {
    dispatch(updatedReview(answer))
    dispatch(updatedSpotReviewRatings(getState().reviews, review.spotId))
  }
  return answer
}

const initialState = {
    id: {},
    spotLatest: {},
};

const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case READ_SPOT_REVIEWS: { /* reviews, spotId */
        let {reviews,spotId} = action.payload
        const oldSpot = state.spots?.id[spotId]
        if (!reviews.length && (oldSpot && oldSpot.reviews && !oldSpot.reviews?.length)) return state; /* nothing to update */
        const normalized = {};
        reviews = [...reviews]
        reviews.forEach(r => {
          r.firstName = r.User.firstName
          delete r.User
          r.images=r.ReviewImages.map(i=>i.id)
          normalized[r.id]=r
        })
        newState = {...state};
        newState.id = {...state.id, ...normalized};
        reviews = reviews.map(r => r.id)
        newState.spotLatest = {...state.spotLatest, [spotId]: reviews}
        return newState;
    }
    case READ_USER_REVIEWS: { /* reviews */
        const reviews = [...action.payload];
        const normalized = {};
        reviews.forEach(r => {
          r.firstName = r.User.firstName
          delete r.User
          r.images=r.ReviewImages.map(i=>i.id)
          normalized[r.id]=r
        })
        /* should have deepCompare here */
        newState = {...state};
        newState.id = {...state.id, ...normalized};
        return newState;
    }
    case CREATED_REVIEW: {
      const {review} = action.payload
      const reviewId = review.id;
      const spotId = review.spotId;
      if (!spotId || !reviewId) throw new Error("baaddd spotId/reviewId for Review", review)
      newState = {...state};
      newState.id = {...state.id, [reviewId]: review}
      if (state.spotLatest[spotId]) {
        newState.spotLatest = {...state.spotLatest}
        newState.spotLatest[spotId] = [reviewId, ...state.spotLatest[spotId]]
      }
      return newState;
    }
    case READ_REVIEW: {
      const review = action.payload
      const reviewId = review.id;
      newState = {...state};
      newState.id = {...state.id, [reviewId]: review}
      return newState
    }
    case UPDATED_REVIEW: {
      const review = action.payload
      const reviewId = review.id;
      const spotId = review.spotId;
      newState = {...state};
      newState.id = {...state.id, [reviewId]: review}
      if (state.spotLatest[spotId]) {
          newState.spotLatest = {...state.spotLatest}
          newState.spotLatest[spotId] = [reviewId, ...state.spotLatest[spotId]]
      }
      return newState
    }
    case DELETED_REVIEW: {
      const {reviewId, spotId} = action.payload
      if (!state.id[reviewId]) return state;
      newState = {...state}
      newState.id = {...state.id}
      delete newState.id[reviewId]
      if (state.spotLatest[spotId]) {
        const index = state.spotLatest[spotId].indexOf(reviewId)
        newState.spotLatest = {...state.spotLatest}
        newState.spotLatest[spotId] = [...state.spotLatest[spotId]]
        newState.spotLatest[spotId].splice(index, 1)
      }
      return newState
    }
    default:
      return state;
  }
};

export default reviewsReducer;
