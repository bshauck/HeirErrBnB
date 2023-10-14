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
import { thunkReadSpot } from "./spots";

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

function deleteReview(reviewId, spotId) {
    return {
        type: DELETE_REVIEW,
        payload: {reviewId, spotId}
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

export const thunkDeleteReview = (id, spotId) => async dispatch => {
  const answer = await fetchData(`/api/reviews/${id}`, {method: 'DELETE'})
  if (!answer.errors) {
    dispatch(deleteReview(id, spotId)) // probably should pass spotId and let other reducer
    dispatch(thunkReadSpot(spotId))
  }
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
    dispatch(createReview(answer))  // recalculate spot info
    dispatch(thunkReadSpot(spotId)) // unsure this is the place
  }
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
    case CREATE_REVIEW: {
      const review = action.payload
      const id = review.id;
      const spotId = review.spotId;
      newState = {...state};
      newState.id = {...state.id, [id]: review}
      newState.spotLatest = {...review.spotLatest}
      if (state.spotLatest[spotId])
        newState.spotLatest[spotId] = {[id]: [review, ...state.spotLatest[spotId]]}
      return newState;
    }
    case READ_REVIEW:
    case UPDATE_REVIEW:{
      const review = action.payload
      const id = review.id;
      const spotId = review.spotId;
      newState = {...state};
      newState.id = {...state.id, [id]: review}
      if (state.spotLatest[spotId])
          newState.spotLatest = {...review.spotLatest,
          [spotId]: [review, ...review.spotLatest[spotId]]}
      return newState;
      }
    case DELETE_REVIEW: {
      const {reviewId, spotId} = action.payload
      if (!state.id[reviewId]) return state;
      newState = {...state}
      newState.id={...state.id}
      delete newState.id[reviewId]
      if (state.spotLatest[spotId])
      delete newState.spotLatest[spotId]
      return newState
    }
    default:
      return state;
  }
};

export default reviewsReducer;
