/* Redux store shape state.spotImages
/*
{  // spotdetails only existing, CUD for Spot
  id:
    {
      [imageId]:
        {
          id,
          spotId,
          url
        }
    }
  spot:
    {
      [spotId]; [imageIds,]
    }
}
*/


import { fetchData } from "./csrf";
import { READ_SPOT } from "./commonActionCreators";

const READ_SPOT_IMAGE = "spotImages/READ_SPOT_IMAGE";
const DELETED_SPOT_IMAGE = "spotImages/DELETED_SPOT_IMAGE";
const CREATED_SPOT_IMAGE = "spotImages/CREATED_SPOT_IMAGE";
const UPDATED_SPOT_IMAGE = "spotImages/UPDATED_SPOT_IMAGE";


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
  id: {},
  spot: {}
};

const spotImagesReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case READ_SPOT: {
      const spotId = action.payload?.id
      const spotImages = action.payload?.SpotImages
      if (!spotId || !spotImages || !spotImages.length) return state
      const normalized = {}
      spotImages.forEach(i => normalized[i.id] = i)
      const keys = Object.keys(normalized)
      if (keys.every(k => k in state.id)) return state
      newState = {...state}
      newState.id = {...state.id, ...normalized}
      newState.spot = {...state.spot}
      newState.spot[spotId] = state.spot[spotId] ?
        [...state.spot[spotId], ...keys] : keys;
      return newState
    }
    case UPDATED_SPOT_IMAGE:
      action.payload = {...state.id[action.payload.id], ...action.payload}
      // eslint-disable-next-line
    case CREATED_SPOT_IMAGE:
    case READ_SPOT_IMAGE: {
      const newImage = action.payload
      newState = {...state}
      newState.id = {...state.id, [newImage.id]: newImage}
      newState.spot = {...state.spot}
      newState.spot[newImage.spotId] = [...state.spot[newImage.spotId], newImage.spotId]
      return newState
    }
    case DELETED_SPOT_IMAGE: {
      const id = action.payload
      if (!state.id[id]) return state
      const spotId = state.id[id].spotId;
      newState = {...state}
      newState.id = {...state.id}
      delete newState.id[id]
      if (!state.spot[spotId]) return newState
      newState.spot = {...state.spot}
      newState[spotId] = [...state[spotId]]
      const delIndex = newState[spotId].indexOf(id)
      newState[spotId].splice(delIndex, 1)
      return newState
    }
    default:
      return state
  }
};

export default spotImagesReducer;
