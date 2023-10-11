/* Redux store shape state.spotImages

{
  [imageId]:
    {
      id,
      spotId,
      url
    }
}
*/


import { fetchData } from "./csrf";
import { READ_SPOT } from "./commonActionCreators";

const READ_SPOT_IMAGES = "spotImages/READ_SPOT_IMAGES";
const READ_SPOT_IMAGE = "spotImages/READ_SPOT_IMAGE";
const DELETED_SPOT_IMAGE = "spotImages/DELETED_SPOT_IMAGE";
const CREATED_SPOT_IMAGE = "spotImages/CREATED_SPOT_IMAGE";
const UPDATED_SPOT_IMAGE = "spotImages/UPDATED_SPOT_IMAGE";


function readAllSpotImages(images) {
    return {
        type: READ_SPOT_IMAGES,
        payload: images
    }
}

// function readSpotImage(spotImage) {
//     return {
//         type: READ_SPOT_IMAGE,
//         payload: spotImage
//     }
// }

function deletedSpotImage(id) {
    return {
        type: DELETED_SPOT_IMAGE,
        payload: id
    };
};

function createdSpotImage(spotImage) {
    return {
        type: CREATED_SPOT_IMAGE,
        payload: spotImage
    };
};

function updatedSpotImage(spotImage) {
    return {
        type: UPDATED_SPOT_IMAGE,
        payload: spotImage
    }
}


export const thunkReadAllSpotImages = spot => async dispatch => {
  const url = `/api/spots/${spot.id}/images`
  const answer = await fetchData(url)
  if (!answer.errors) {
    spot.spotImages = answer.SpotImages
    dispatch(readAllSpotImages(answer.SpotImages, spot.id))
  }
  return answer
}

// export const thunkReadSpotImage = id => async dispatch => {
//   const url = `/api/spot-images/${id}`
//   const answer = await fetchData(url)
//   if (!answer.errors) dispatch(readSpotImage(answer))
//   return answer
// }

export const thunkDeletedSpotImage = id => async dispatch => {
  const answer = await fetchData(`/api/spot-images/${id}`, {method: 'DELETE'})
  if (!answer.errors) dispatch(deletedSpotImage(id))
  return answer
}

export const thunkCreatedSpotImage = spotImage => async dispatch => {
  const { spotId, urls } = spotImage;
  const url = `/api/spots/${spotId}/images`
  const options = {
    method: "POST",
    body: JSON.stringify({
      spotId,
      urls
    })
  }
  const answer = await fetchData(url, options)
  if (!answer.errors) dispatch(createdSpotImage(answer))
  return answer
}

export const thunkUpdatedSpotImage = spotImageObj => async dispatch => {
  const { id, spotId, url } = spotImageObj;
  const options = {
    method: "PUT",
    body: JSON.stringify({
      id,
      spotId,
      url
    })
  }
  const answer = await fetchData(`/api/spots/${spotId}/images`, options)
  if (!answer.errors) dispatch(updatedSpotImage(answer))
  return answer
}

const initialState = {
};

const spotImagesReducer = (state = initialState, action) => {
  let newState;
  let spotImages = action.payload
  switch (action.type) {
    case READ_SPOT:
      spotImages = spotImages.SpotImages // eslint-disable-next-line
    case READ_SPOT_IMAGES: {
      const normalized = {}
      spotImages.forEach(r => normalized[r.id]=r)
      newState = {...state, ...normalized}
      return newState
    }
    case UPDATED_SPOT_IMAGE:
      action.payload = {...state[action.payload.id], ...action.payload}
      // eslint-disable-next-line
    case CREATED_SPOT_IMAGE:
    case READ_SPOT_IMAGE:
      newState = {...state, [action.payload.id]: action.payload};
      return newState
    case DELETED_SPOT_IMAGE:
      newState = {...state}
      delete newState[action.payload]
      return newState
    default:
      return state
  }
};

export default spotImagesReducer;
