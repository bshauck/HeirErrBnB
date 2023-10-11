/* Store shape for ReviewImages
{
  [imageId]:
    {
      id,
      reviewId,
      url
    }
}
*/
import { fetchData } from "./csrf";

const READ_REVIEW_IMAGES = "reviewImages/READ_REVIEW_IMAGES";
const READ_REVIEW_IMAGE = "spotImages/READ_REVIEW_IMAGE";
const DELETED_REVIEW_IMAGE = "reviewImages/DELETED_REVIEW_IMAGE";
const CREATED_REVIEW_IMAGE = "reviewImages/CREATED_REVIEW_IMAGE";
const UPDATED_REVIEW_IMAGE = "reviewImages/UPDATED_REVIEW_IMAGE";

function readAllReviewImages(images) {
    return {
        type: READ_REVIEW_IMAGES,
        payload: images
    }
}
// function readReviewImage(image) {
//     return {
//         type: READ_REVIEW_IMAGE,
//         payload: image
//     }
// }

function deletedReviewImage(id) {
    return {
        type: DELETED_REVIEW_IMAGE,
        payload: id
    };
};

function createdReviewImage(reviewImage) {
    return {
        type: CREATED_REVIEW_IMAGE,
        payload: reviewImage
    };
};

function updatedReviewImage(reviewImage) {
    return {
        type: UPDATED_REVIEW_IMAGE,
        payload: reviewImage
    }
}


export const thunkReadAllReviewImages = review => async dispatch => {
  const url = `/api/reviews/${review.id}/images`
  const answer = await fetchData(url)
  if (!answer.errors) {
    review.reviewImages = answer.ReviewImages
    dispatch(readAllReviewImages(answer.ReviewImages, review.id))
  }
  return answer
}


// export const thunkReadReviewImage = id => async dispatch => {
//   const url = `/api/spot-images/${id}`
//   const answer = await fetchData(url)
//   if (!answer.errors) dispatch(readReviewImage(answer))
//   return answer
// }


export const thunkDeletedReviewImage = id => async dispatch => {
  const answer = await fetchData(`/api/review-images/${id}`, {method: 'DELETE'})
  if (!answer.errors) dispatch(deletedReviewImage(id))
  return answer
}

export const thunkCreatedReviewImage = (reviewImageArg, firstName) => async dispatch => {
  const { reviewId, urls } = reviewImageArg;
  const url = `/api/reviews/${reviewId}/images`
  const options = {
    method: "POST",
    body: JSON.stringify({
      reviewId,
      urls
    })
  }
  const answer = await fetchData(url, options)
  if (!answer.errors) {
    answer.firstName = firstName
  } dispatch(createdReviewImage(answer))
  return answer
}

export const thunkUpdatedReviewImage = reviewImage => async dispatch => {
  const { id, reviewId, url } = reviewImage;
  const options = {
    method: "PUT",
    body: JSON.stringify({
      id,
      reviewId,
      url
    })
  }
  const answer = await fetchData(`/api/reviewImages/${id}`, options)
  if (!answer.errors) dispatch(updatedReviewImage(answer))
  return answer
}

const initialState = {
};

const reviewImagesReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case READ_REVIEW_IMAGES: {
        const reviewImages = action.payload.reviewImages;
        const normalized = {};
        reviewImages.forEach(r => normalized[r.id]=r)
        newState = {...state, ...normalized};
        return newState;
    }
    case UPDATED_REVIEW_IMAGE:
      action.payload = {...state[action.payload.id], ...action.payload}
    case CREATED_REVIEW_IMAGE:
    case READ_REVIEW_IMAGE:
      newState = {...state, [action.payload.id]: action.payload};
      return newState;
    case DELETED_REVIEW_IMAGE:
      newState = {...state};
      delete newState[action.payload]
      return newState
    default:
      return state;
  }
};

export default reviewImagesReducer;
