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
        "previewUrl": "image url"
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
        },
        {
          "id": 2,
          "url": "image url",
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
old userSpots now are keys in state.users.spots, and the spot info is
in state.spots.id
{
  id:
    {
      [spotId]:
        {
          id: 1,
          ownerId: 1,
          address: "123 Disney Lane",
          city: "San Francisco",
          state: "California",
          country: "United States",
          lat: 37.7645358,
          lng: -122.4730327,
          name: "App Academy",
          description: "Place where web developers are created",
          price: 123,
          createdAt: "2021-11-19 20:39:36",
          updatedAt: "2021-11-19 20:39:36",
          numReviews: 4,
          avgRating: 4.5,
          previewUrl: "image url",

          // additional info; Details page gets images & reviews
          // reserve button gets bookings
          images: [spotImageIds,],
          reviews: [reviewIds,],
          // bookings: [bookingIds,], // perhaps only ids with future endDates
        },
    }
  userQuery: { [userId]: [orderedSpotIdsBySomeInterestingCriteriaFromQuery], }
}
*/

import { CREATED_REVIEW, CREATED_SPOT, DELETED_REVIEW, DELETED_SPOT, READ_SPOT, READ_SPOT_REVIEWS, READ_USER_SPOTS, UPDATED_SPOT_REVIEW_RATINGS } from "./commonActionCreators";

import { csrfFetch, fetchData, jsonHeaderContent } from "./csrf";

const READ_SPOTS = "spots/READ_SPOTS";
const UPDATED_SPOT = "spots/UPDATED_SPOT";

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

function deletedSpot(id) {
    return {
        type: DELETED_SPOT,
        payload: id
    };
};

function createdSpot(spot) {
    return {
        type: CREATED_SPOT,
        payload: spot
    };
};

function updatedSpot(spot) {
    return {
        type: UPDATED_SPOT,
        payload: spot
    }
}

export const thunkReadAllSpots = () => async dispatch => {
  const url = `/api/spots`
  const answer = await fetchData(url)
  if (!answer.errors) dispatch(readAllSpots(answer.Spots))
  return answer.Spots
}


export const thunkReadAllUserSpots = () => async dispatch => {
  const url = '/api/spots/current'
  const answer = await fetchData(url)
  if (!answer.errors) dispatch(readAllUserSpots(answer.Spots))
  return answer
}

export const thunkReadSpot = id => async dispatch => {
  console.log("thunkreadspot id", id)
  if (typeof id === 'object')
  console.log("🚀 ~ thunkReadSpot ~values of id:", Object.values(id) )
  else if (typeof id === 'undefined') throw new Error('eek')

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
  if (!answer.errors) dispatch(deletedSpot(id))
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
      "previewUrl": "image url",
      "SpotImages": [
        {
          "id": 1,
          "url": "image url",
        },
*/

/* TODO eventually it should be wrapped in a transaction and
rolled back if errors in either spot or image creations */
export const thunkCreateSpot = (spot, urls) => async dispatch => {
  const { ownerId, address, city, state, country, lat, lng, name, description, price, previewUrl } = spot;
  const url = `/api/spots`
  const options = {
    method: "POST",
    headers: jsonHeaderContent,
    body: JSON.stringify({
      ownerId, address, city, state, country, lat, lng,
      name, description, price, previewUrl
  })
  }
  const answer = await fetchData(url, options)
  if (!answer.errors) {
    answer.numReviews = 0; /* ponder in db */
    answer.avgRating = null; /* ponder in db */
    options.body = JSON.stringify(urls)
    const answer2 = await csrfFetch(`/api/spots/${answer.id}/images`, options)
    if (!answer2.errors) {
      dispatch(createdSpot(answer))
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
    dispatch(updatedSpot(answer))
  }
  return answer
}

const initialState = { /* for {} at state.spots */
    id: {}, /* when filled, normalized by spotId: {spotData} */
    userQuery: {}, /* when filled, {[userId}: [spotIdsLandingOrderdBySomeUserQuery]} */
};


const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case READ_SPOTS: {
        const normalized = {};
        action.payload.forEach(s => normalized[s.id]=s)
        newState = {...state}
        newState.id = {...state.id, ...normalized};
        return newState;
    }
    case READ_USER_SPOTS: {
        const normalized = {};
        action.payload.forEach(s => normalized[s.id]=s)
        newState = {...state, "id": {...state.id, ...normalized}};
        return newState;
    }
    case CREATED_SPOT:
    case UPDATED_SPOT: {
      const spot = action.payload
      const id = spot.id;
      newState = {...state};
      newState.id = {...state.id, [id]: spot};
      return newState;
    }
    case READ_SPOT: { /* old singleSpot */
      const id = action.payload.id
      const spot = action.payload
      const images = action.payload.SpotImages.map(s=>s.id)
      spot.images = images
      newState = {...state}
      newState.id = {...state.id,  [id]: spot}
      return newState
    }

    case DELETED_SPOT: /* payload is spotId */
      newState = {...state};
      newState.id = {...state.id};
      delete newState.id[action.payload]
      return newState;

    case READ_SPOT_REVIEWS: {
      let {reviews, spotId} = action.payload
      reviews = reviews.map(r=>r.id)
      newState = {...state}
      newState.id = {...state.id}
      newState.id[spotId] = {...state.id[spotId], reviews }
      return newState
    }
    case DELETED_REVIEW: {
      const {reviewId, spotId} = action.payload
      const reviews = [...state.id[spotId].reviews]
      const index = reviews.indexOf(reviewId)
      if (index === -1) {
        console.log("FAILED to find review to deleete in spot; reviewId, spotId", reviewId, spotId);
        return state
      }
      reviews.splice(index, 1)
      newState = {...state}
      newState.id = {...state.id}
      newState.id[spotId] = {...state.id[spotId], reviews}
      return newState
    }
    case CREATED_REVIEW: {
      const {review} = action.payload
      const spotId = review.spotId
      const spot = state.id[spotId]
      console.log("🚀 ~ spotsReducer ~ review, spotId, spot:", review, spotId, spot)
      const reviews = [review.id, ...spot.reviews]
      newState = {...state}
      newState.id = {...state.id}
      newState.id[spotId] = {...state.id[spotId], reviews}
      return newState
    }
    case UPDATED_SPOT_REVIEW_RATINGS: {
      const {spotId, numReviews, avgRating} = action.payload
      const spot = state.id[spotId]
      if (spot.numReviews === numReviews && spot.avgRating === avgRating) return state
      newState = {...state}
      newState.id = {...state.id}
      newState.id[spotId] = {...state.id[spotId], numReviews, avgRating}
      return newState
    }
    default:
      return state;
  }
};

export default spotsReducer;
