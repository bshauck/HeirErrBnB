/* spots slice of state
{
  "allSpots": {
    [spotId]:
      {
        "id": 1,
        "ownerId": 1,
        "address": "123 Disney Lane",
        "city": "San Francisco",
        "state": "California",
        "country": "United States",
        "lat": 37.7645358,
        "lng": -122.4730327,
        "name": "App Academy",
        "description": "Place where web developers are created",
        "price": 123,
        "createdAt": "2021-11-19 20:39:36",
        "updatedAt": "2021-11-19 20:39:36",
        "avgRating": 4.5,
        "previewImage": "image url"
      }
    optionalOrderedList: [],
    }
  singleSpot: { // spot details
      "id": 1,
      "ownerId": 1,
      "address": "123 Disney Lane",
      "city": "San Francisco",
      "state": "California",
      "country": "United States",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "App Academy",
      "description": "Place where web developers are created",
      "price": 123,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36" ,
      "numReviews": 5,
      "avgRating": 4.5,
      "SpotImages": [ // put into
        {
          "id": 1,
          "url": "image url",
          "preview": true
        },
        {
          "id": 2,
          "url": "image url",
          "preview": false
        }
      ],
      "Owner": { // put into session as partialUser
        "id": 1,
        "firstName": "John",
        "lastName": "Smith"
      }
    }
  userSpots: { // all owner ids are the same
    [spotId]:
      {
        "id": 1,
        "ownerId": 1,
        "address": "123 Disney Lane",
        "city": "San Francisco",
        "state": "California",
        "country": "United States",
        "lat": 37.7645358,
        "lng": -122.4730327,
        "name": "App Academy",
        "description": "Place where web developers are created",
        "price": 123,
        "createdAt": "2021-11-19 20:39:36",
        "updatedAt": "2021-11-19 20:39:36",
        "avgRating": 4.5,
        "previewImage": "image url"
      }
    }
}
*/

/* New store shape for spots
{
  [spotId]:
    {
      "id": 1,
      "ownerId": 1,
      "address": "123 Disney Lane",
      "city": "San Francisco",
      "state": "California",
      "country": "United States",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "App Academy",
      "description": "Place where web developers are created",
      "price": 123,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
      "numReviews": 4,
      "avgRating": 4.5,
      "previewImage": "image url",

      // additional info; Details page gets images & reviews
      // reserve button gets bookings
      "images": [spotImageIdArray],
      "reviews": [reviewIdArray],
      "bookings": [bookingIdArray], // perhaps only ids whose endDate is in the future
    }
  "list": [orderedIdArrayBySomeInterestingCriteriaFromQuery]
}
*/



import { csrfFetch, fetchData, jsonHeaderContent } from "./csrf";

const READ_SPOTS = "spots/READ_SPOTS";
const READ_USER_SPOTS = "spots/READ_USER_SPOTS";
export const READ_SPOT = "spots/READ_SPOT";
const DELETE_SPOT = "spots/DELETE_SPOT";
const CREATE_SPOT = "spots/CREATE_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";

function readAllSpots(spots) {
    return {
        type: READ_SPOTS,
        payload: spots
    }
}

export function readAllUserSpots(spots) {
    return {
        type: READ_USER_SPOTS,
        payload: spots
    }
}

function readSpot(spot) {
    return {
        type: READ_SPOT,
        payload: spot
    }
}

function deleteSpot(id) {
    return {
        type: DELETE_SPOT,
        payload: id
    };
};

function createSpot(spot) {
    return {
        type: CREATE_SPOT,
        payload: spot
    };
};

function updateSpot(spot) {
    return {
        type: UPDATE_SPOT,
        payload: spot
    }
}

export const thunkReadAllSpots = () => async dispatch => {
  const url = `/api/spots`
  const answer = await fetchData(url)
  if (!answer.errors) dispatch(readAllSpots(answer.Spots))
  return answer.Spots
}


export const thunkReadAllUserSpots = (args) => async dispatch => {
  const url = '/api/spots/current'
  const answer = await fetchData(url)
  if (!answer.errors) dispatch(readAllUserSpots(answer.Spots))
  return answer
}

export const thunkReadSpot = id => async dispatch => {
  const url = `/api/spots/${id}`
  const answer = await fetchData(url)
  if (!answer.errors) dispatch(readSpot(answer))
  return answer
}

export const thunkDeleteSpot = id => async dispatch => {
  const url = `/api/spots/${id}`
  const options = {
    method: "DELETE",
  }
  const answer = await fetchData(url, options)
  if (!answer.errors) dispatch(deleteSpot(id))
  return answer
}

/*
     "id": 1,
      "ownerId": 1,
      "address": "123 Disney Lane",
      "city": "San Francisco",
      "state": "California",
      "country": "United States",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "App Academy",
      "description": "Place where web developers are created",
      "price": 123,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36" ,
      "SpotImages": [
        {
          "id": 1,
          "url": "image url",
          "preview": true
        },
*/

/* TODO eventually it should be wrapped in a transaction and
rolled back if errors in either spot or image creations */
export const thunkCreateSpot = (spot, urls) => async dispatch => {
  const { ownerId, address, city, state, country, lat, lng, name, description, price } = spot;
  const url = `/api/spots`
  const options = {
    method: "POST",
    headers: jsonHeaderContent,
    body: JSON.stringify({
      ownerId, address, city, state, country, lat, lng,
      name, description, price
  })
  }
  const answer = await fetchData(url, options)
  if (!answer.errors) {
    answer.numReviews = 0; /* ponder in db */
    answer.avgRating = null; /* ponder in db */
    options.body = JSON.stringify(urls)
    const answer2 = await csrfFetch(`/api/spots/${answer.id}/images`, options)
    if (!answer2.errors) {
      dispatch(createSpot(answer))
      /* TODO dispatch(createdImages()) */
    }
  }
  return answer
}

export const thunkUpdateSpot = (spot /*, urls */) => async dispatch => {
  const { id, ownerId, address, city, state, country, lat, lng, name, description, price } = spot;
  const url = `/api/spots/${spot.id}`
  const options = {
    method: "PUT",
    headers: jsonHeaderContent,
    body: JSON.stringify({
      id, ownerId, address, city, state, country, lat, lng,
      name, description, price
    })
  }
  /* TODO haven't come up with a good approach for URL updating yet
  * it could be a mixture of updates and creation
  */
  const answer = await fetchData(url, options)
  if (!answer.errors) {
    dispatch(updateSpot(answer))
  }
  return answer
}

const initialState = { /* for {} at state.spots */
    allSpots: {}, /* when filled, normalized by spotId: {spotData} */
    singleSpot: {}, /* when filled, {spotData} */
    userSpots: {} /* when filled, normalized by spotId: {spotData} */
};

const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case READ_SPOTS: {
        const normalized = {};
        action.payload.forEach(s => normalized[s.id]=s)
        newState = {...state, allSpots: normalized};
        return newState;
    }
    case READ_USER_SPOTS: {
        const normalized = {};
        action.payload.forEach(s => normalized[s.id]=s)
        newState = {...state, userSpots: normalized};
        return newState;
    }
    case CREATE_SPOT:
    case UPDATE_SPOT: {
      const spot = action.payload
      const id = spot.id;
      newState = {...state};
      newState.allSpots = {...state.allSpots, [id]: spot};
      if (state.session?.user?.id === spot.ownerId)
        newState.userSpots = {...state.userSpots, [id]: spot};
      if (state.singleSpot?.id === id)
        newState.singleSpot = {...state.singleSpot, ...spot}
      return newState;
    }
    case READ_SPOT: {
      const id = action.payload.id;
      const previewImage = action.payload.SpotImages.find(e => e.preview).url;
      const spot = {...action.payload, previewImage};
      newState = {...state};
      newState.singleSpot = spot;
      newState.allSpots = {...state.allSpots,  [id]: spot};
      if (state.session?.user?.id === spot.ownerId)
        newState.userSpots = {...state.userSpots,  [id]: spot};
      return newState;
    }

    case DELETE_SPOT:
      newState = {...state};
      newState.allSpots = {...state.allSpots};
      delete newState.allSpots[action.payload]
      newState.userSpots = {...state.userSpots};
      delete newState.userSpots[action.payload];
      if (newState.singleSpot?.id === action.payload)
        newState.singleSpot = {};
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
