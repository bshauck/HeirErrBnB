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
  singleSpot: {
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

import { csrfFetch } from "./csrf";

const READ_SPOTS = "spots/READ_SPOTS";
const READ_USER_SPOTS = "spots/READ_USER_SPOTS";
export const READ_SPOT = "spots/READ_SPOT";
const DELETE_SPOT = "spots/DELETE_SPOT";
const CREATE_SPOT = "spots/CREATE_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";

function readAllSpots(spots) {
    console.log("🚀 ~ file: spots.js:91 ~ readAllSpots ~ spots:", spots)
    return {
        type: READ_SPOTS,
        payload: spots
    }
}

export function readAllUserSpots(spots) {
    console.log("🚀 ~ file: spots.js:99 ~ readAllUserSpots ~ spots:", spots)
    return {
        type: READ_USER_SPOTS,
        payload: spots
    }
}

function readSpot(spot) {
    console.log("🚀 ~ file: spots.js:107 ~ readSpot ~ spot:", spot)
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

export const thunkREADAllSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  const data = await response.json();
  console.log("🚀 ~ file: spots.js:135 ~ thunkREADAllSpots ~ data:", data)
  dispatch(readAllSpots(data.Spots));
  return response;
};

export const thunkREADAllUserSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");
  const data = await response.json();
  dispatch(readAllUserSpots(data.Spots));
  return response;
};

export const thunkREADSpot = id => async dispatch => {
    console.log("🚀 ~ file: spots.js:150 ~ thunkREADSpot ~ id:", id)
    const response = await csrfFetch(`/api/spots/${id}`);
    const data = await response.json();
    console.log("🚀 ~ file: spots.js:149 ~ thunkREADSpot ~ data:", data)
    dispatch(readSpot(data));
    return response;
};

export const thunkDELETESpot = id => async dispatch => {
    console.log("🚀 ~ file: spots.js:159 ~ thunkDELETESpot ~ id:", id)
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    console.log("🚀 ~ file: spots.js:159 ~ thunkDELETESpot ~ data:", data)
    dispatch(deleteSpot(data));
    return response;
};

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

export const thunkCREATESpot = (spot, urls) => async dispatch => {
  console.log("🚀 ~ file: spots.js:194 ~ thunkCREATESpot ~ urls:", urls)
  console.log("🚀 ~ file: spots.js:194 ~ thunkCREATESpot ~ spot:", spot)
  let data;
  const { ownerId, address, city, state, country, lat, lng, name, description, price } = spot;
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify({
      ownerId, address, city, state, country, lat, lng,
      name, description, price
  })});

  if (response.status < 400) {
    data = await response.json();
    console.log("🚀 ~ file: spots.js:204 ~ thunkCREATESpot ~ data:", data)
    console.log("🚀 ~ file: spots.js:206 ~ thunkCREATESpot ~ urls:", urls)
    for (const u of urls.urls)
      console.log("🚀 ~ file: spots.js:208 ~ thunkCREATESpot ~ u:", u)

    const response2 = await csrfFetch(`/api/spots/${data.id}/images`, {
      method: "POST",
      body: JSON.stringify(urls)});
    if (response2.status < 400)
      await response2.json();
  } else return response;

  /* don't need to return this data, just pass any error
    * officially it all should be in a trnasaction and rolled
    * back, sigh
    */
  dispatch(createSpot(data));
  return data;
};

export const thunkUPDATESpot = (spot /*, urls */) => async dispatch => {
  console.log("🚀 ~ file: spots.js:224 ~ thunkUPDATESpot ~ spot:", spot)
  /* TODO when images added in change */
  const { address, city, state, country, lat, lng, name, description, price } = spot;
  const response = await csrfFetch(`/api/spots/${spot.id}`, {
    method: "PUT",
    body: JSON.stringify({
      address, city, state, country, lat, lng,
      name, description, price
    }),
  });

  /* TODO haven't come up with a good approach for URL updating yet
  * it could be a mixture of updates and creation
  */
  console.log("🚀 ~ file: spots.js:210 ~ thunkUPDATESpot ~ spot:", spot)
  const data = await response.json();
  dispatch(updateSpot(data));
  return response;
};

function copyNormWithout(oldNorm, key) {
  /* if the state doesn't contain the item, then no change is needed;
   * otherwise, return a newObject that has everything but that
   * particular key
   */
  if (!oldNorm || !oldNorm[key]) return oldNorm;
  const result = {};
  Object.keys(oldNorm).forEach(k => {if (k !== key) result[k] = oldNorm[k]});
  return result;
}

const initialState = { /* for {} at state.spots */
    allSpots: {}, /* when filled, normalized by spotId: {spotData} */
    singleSpot: {}, /* when filled, {spotData} */
    userSpots: {} /* when filled, normalized by spotId: {spotData} */
};

const spotsReducer = (state = initialState, action) => {
  console.log("🚀 ~ file: spots.js:223 ~ spotsReducer ~ action:", action)
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
      newState.allSpots = copyNormWithout(state.allSpots, action.payload);
      newState.userSpots = copyNormWithout(state.userSpots, action.payload);
      if (newState.singleSpot?.id === action.payload)
        newState.singleSpot = {};
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
