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

import { READ_SPOT_REVIEWS, READ_USER_REVIEWS } from "./commonActionCreators";
import { fetchData } from "./csrf";


const READ_REVIEW = "reviews/READ_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";
const CREATE_REVIEW = "reviews/CREATE_REVIEW";
const UPDATE_REVIEW = "reviews/UPDATE_REVIEW";


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

function deleteReview(id) {
    return {
        type: DELETE_REVIEW,
        payload: id
    };
};

function createReview(review) {
    return {
        type: CREATE_REVIEW,
        payload: review
    };
};

function updateReview(review) {
    return {
        type: UPDATE_REVIEW,
        payload: review
    }
}


export const thunkReadAllReviews = spot => async dispatch => {
  console.log("🚀 ~ file: reviews.js:99 ~ thunkReadAllReviews ~ spot:", spot)
  const url = `/api/spots/${spot.id}/reviews`
  const answer = await fetchData(url)
  console.log("🚀 ~ file: reviews.js:102 ~ thunkReadAllReviews ~ answer:", answer)
  if (!answer.errors) {
    spot.reviews = answer.Reviews
    dispatch(readAllSpotReviews(answer.Reviews, spot.id))
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

export const thunkDeleteReview = id => async dispatch => {
  const answer = await fetchData(`/api/reviews/${id}`, {method: 'DELETE'})
  if (!answer.errors) dispatch(deleteReview(id))
  return answer
}

export const thunkCreateReview = (review, firstName) => async dispatch => {
  const { spotId, userId, commentary, stars } = review;
  const url = `/api/spots/${spotId}/reviews`
  const options = {
    method: "POST",
    body: JSON.stringify({
      spotId,
      userId,
      commentary,
      stars
    })
  }
  const answer = await fetchData(url, options)
  if (!answer.errors) {
    answer.firstName = firstName
  } dispatch(createReview(answer))
  return answer
}

export const thunkUpdateReview = review => async dispatch => {
  const { id, spotId, userId, commentary, stars } = review;
  const url = `/api/reviews/${id}`
  const options = {
    method: "PUT",
    body: JSON.stringify({
      id,
      spotId,
      userId,
      commentary,
      stars
    })
  }
  const answer = await fetchData(url, options)
  if (!answer.errors) dispatch(updateReview(answer))
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
        const reviews = action.payload.reviews;
        if (!reviews.length) return state; /* nothing to update */
        const normalized = {};
        reviews.forEach(r => normalized[r.id]=r)
        newState = {...state};
        newState.id = {...state.id, ...normalized};
        newState.spotLatest = {...state.spotLatest, }
        return newState;
    }
    case READ_USER_REVIEWS: {
        const reviews = action.payload;
        const normalized = {};
        reviews.forEach(r => normalized[r.id]=r)
        newState = {...state};
        newState.user = normalized;
        return newState;
    }
    case CREATE_REVIEW:
    case READ_REVIEW:
    case UPDATE_REVIEW:
      const review = action.payload
      const id = review.id;
      newState = {...state};
      newState.spot = {...state.spot, [id]: review};
      newState.user = {...state.user, [id]: review};
      return newState;
    case DELETE_REVIEW:
      newState = {...state};
      newState.spot = {...state.spot};
      delete newState.spot[action.payload]
      newState.user = {...state.user};
      delete newState.user[action.payload];
      return newState
    default:
      return state;
  }
};

export default reviewsReducer;
