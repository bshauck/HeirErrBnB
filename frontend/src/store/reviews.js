/* reviews slice of state
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
import { csrfFetch } from "./csrf";

console.log("made it to beginning of store.reviews.js")

const READ_REVIEWS = "reviews/READ_REVIEWS";
const READ_USER_REVIEWS = "reviews/READ_USER_REVIEWS";
const READ_REVIEW = "reviews/READ_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";
const CREATE_REVIEW = "reviews/CREATE_REVIEW";
const UPDATE_REVIEW = "reviews/UPDATE_REVIEW";

console.log("made it to beginning of store.reviews.js")


function readAllReviews(reviews) {
    return {
        type: READ_REVIEWS,
        payload: reviews
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
console.log("made it to beginning of store.reviews.js")

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

export const thunkReadAllReviews = id => async dispatch => {
  const response = await csrfFetch(`/api/spots/${id}/reviews`);
  const data = await response.json();
  dispatch(readAllReviews(data.Reviews));
  return response;
};

export const thunkReadAllUserReviews = () => async dispatch => {
  const response = await csrfFetch("/api/reviews/current");
  const data = await response.json();
  dispatch(readAllUserReviews(data.Reviews));
  return response;
};

export const thunkReadReview = id => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${id}`);
    const data = await response.json();
    dispatch(readReview(data));
    return response;
};

export const thunkDeleteReview = id => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${id}`, {
        method: 'DELETE',
    });
    await response.json();
    dispatch(deleteReview(id));
    return response;
};

export const thunkCreateReview = (reviewArg,firstName) => async dispatch => {
  const { spotId, userId, review, stars } = reviewArg;
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify({
      spotId,
      userId,
      review,
      stars
    }),
  });
  const data = await response.json();
  data.firstName=firstName;
  dispatch(createReview(data));
  return response;
};

export const thunkUpdateReview = reviewObj => async dispatch => {
  const { id, spotId, userId, review, stars } = reviewObj;
  const response = await csrfFetch(`/api/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify({ /* fill out */
      id,
      spotId,
      userId,
      review,
      stars
   }),
  });
  const data = await response.json();
  dispatch(updateReview(data));
  return response;
};

const initialState = {
    spot: {},
    user: {},
};

const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case READ_REVIEWS: {
        const reviews = action.payload;
        const normalized = {};
        reviews.forEach(r => normalized[r.id]=r)
        newState = {...state};
        newState.spot = normalized;
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
