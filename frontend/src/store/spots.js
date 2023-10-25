/* spots slice of state
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
          previewUrl: "image url",


          // additional info; Details page gets images & reviews
          createdAt: "2021-11-19 20:39:36",
          updatedAt: "2021-11-19 20:39:36",
          numReviews: 4, // not kept in table
          avgRating: 4.5, // not kept in table

          images: [spotImageIds,],
          reviews: [reviewIds,],
          bookings: [bookingIds,], // only ids with future endDates
        },
    }
  userQuery: { [userId]: [orderedSpotIdsBySomeInterestingCriteriaFromQuery], }
}
*/

import { CREATED_REVIEW, CREATED_SPOT, DELETED_REVIEW, DELETED_SPOT, READ_SPOT, READ_SPOT_REVIEWS, READ_USER_SPOTS, UPDATED_SPOT_REVIEW_RATINGS } from "./commonActionCreators";

import { fetchData, jsonHeaderContent } from "./csrf";

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
  const url = `/api/spots`
  const options = {
    method: "POST",
    body: JSON.stringify(spot)
  }
  const answer = await fetchData(url, options)
  if (!answer.errors) {
    answer.numReviews = 0; /* ponder in db */
    answer.avgRating = null; /* ponder in db */
    options.body = JSON.stringify(urls)
    const answer2 = await fetchData(`/api/spots/${answer.id}/images`, options)
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
        newState = {...state}
        newState.id = {...state.id}
        if (Object.keys(state.id).length > action.payload.length) {
          action.payload.forEach(s => newState.id[s.id] = {...state.id[s.id], ...s})
        }
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
    case READ_SPOT: {
      const id = action.payload.id
      const spot = {...action.payload}
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
      if (index === -1) return state
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
