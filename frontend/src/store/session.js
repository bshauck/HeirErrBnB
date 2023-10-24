/* session slice of state with user
{
  user: {
    id,
    email,
    username,
    firstName,
    lastName,
    createdAt,  /// TODO?
    updatedAt   /// TODO?
  }
}

and without logged-in user

{
  user: null
}
*/

/* I'll leave the above, but this will really be the user
   /* session */ /*
  {
    user: current user || null
    spots: same as user>spots [spotIds,]
    reviews: same as user>reviews [reviewIds,]
    bookings: same as user>bookings [bookingIds,]
    id: // normalized user info
    {
     [userId]:
       { // partial from review reads
         id,
         firstName,
         lastName,

         // additional detail on login (passwords only in db)
         email,
         username,

         // additional detail w/ current spots/review/bookings
         spots: [spotIds,],
         reviews: [reviewIds,], // all reviews of user
         bookings: [bookingIds,],
         // spotQuery: [landingPageQueryParamString], // TODO
         // currentPage: 3 // last displayed page of info // TODO
       }
    }
  }
 */

import { fetchData } from "./csrf";
import { CREATED_BOOKING, CREATED_REVIEW, CREATED_SPOT, DELETED_BOOKING, DELETED_REVIEW, DELETED_SPOT, READ_SPOT, READ_SPOT_REVIEWS, READ_USER_BOOKINGS, READ_USER_REVIEWS, READ_USER_SPOTS } from "./commonActionCreators";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const SET_SPOT_OWNER = "session/SET_SPOT_OWNER"

export const setSpotOwner = (partialUser) => {
  return {
    type: SET_SPOT_OWNER,
    payload: partialUser,
  };
};

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const thunkLogin = user => async dispatch => {
  const { credential, password } = user;
  const url = `/api/session`
  const options = {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    })
  }
  const answer = await fetchData(url, options)
  if (!answer.errors) dispatch(setUser(answer.user))
  else throw answer;
  return answer.user
}

export const thunkSignup = user => async dispatch => {
  const { username, firstName, lastName, email, password } = user;
  const url = `/api/users`
  const options = {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    })
  }
  const answer = await fetchData(url, options)
  if (!answer.errors) dispatch(setUser(answer.user))
  return answer
}

export const thunkLogout = () => async dispatch => {
  const answer = await fetchData(`/api/session`, { method: 'DELETE' })
  if (!answer.errors) dispatch(removeUser())
  return answer
}

function deleteIdFromUserArrays(newState, state, key, deleted) {
  /* caller must RETURN what this returns */
  newState.user = {...state.user}
  const index = state[key].indexOf(deleted)
  if (index === -1) return state
  newState.id[state.user.id][key] = newState[key] = newState.user[key] = [...state[key]]
  newState[key].splice(index, 1)
  return newState
}
function addIdToUserArrays(newState, state, key, createdId) {
  newState.user = {...state.user}
  const old = state[key] ?? []
  newState.id[state.user.id][key] = newState[key] = newState.user[key] = [...old, createdId]
  return newState
}
function setIdsIntoUserArrays(newState, state, key, array) {
  if (!array) return state;
  newState.user = {...state.user}
  const ids = array.map(elt => elt.id)
  newState.id[state.user.id][key] = newState[key] = newState.user[key] = ids
  return newState
}

const initialState = {
  user: null,
  id: {},
  spots: null,
  reviews: null,
  bookings: null,
 };

const sessionReducer = (state = initialState, action) => {
  const newState = {...state, "id": {...state.id}};

  switch (action.type) {
    case SET_USER:
      const newUser = action.payload
      newState.user = newUser;
      if (newUser)
        newState.id[newUser.id] = {...(state.id[newUser.id] ? {...state.id[newUser.id]}: {}), ...newUser}
      return newState;

    case READ_SPOT: {
      const partialUser = action.payload.User
      let userId;
      if (!partialUser || !(userId = partialUser.id) || state.id[userId])
        return state; /* already have this */
      newState.id[userId] = partialUser;
      return newState;
    }
    case READ_SPOT_REVIEWS: {
      const { reviews } = action.payload
      const partialUsers = reviews.map(pu => pu.User);
      if (partialUsers.every(pu => state.id[pu.id])) return state;
      partialUsers.forEach(pu => newState.id[pu.id] = pu)
      return newState;
    }
    case REMOVE_USER: /* don't remove key; names still used in spot details */
      newState.user = newState.reviews = newState.spots = newState.bookings = null;
      return newState;

    case READ_USER_BOOKINGS:
      console.log("session reducer READ U BOOKINGS")
      return setIdsIntoUserArrays(newState, state, "bookings", action.payload)
    case READ_USER_REVIEWS:
      return setIdsIntoUserArrays(newState, state, "reviews", action.payload)
    case READ_USER_SPOTS:
      return setIdsIntoUserArrays(newState, state, "spots", action.payload)
    case DELETED_BOOKING:
      console.log("session reducer DELTE U BOOKING", action.payload)
      return deleteIdFromUserArrays(newState, state, "bookings", action.payload)
    case DELETED_SPOT:
      return deleteIdFromUserArrays(newState, state, "spots", action.payload)
    case DELETED_REVIEW:
      return deleteIdFromUserArrays(newState, state, "reviews", action.payload.reviewId)
      case CREATED_BOOKING:
        console.log("session reducer CREATED U BOOKING", action.payload)
        return addIdToUserArrays(newState, state, "bookings", action.payload.id)
    case CREATED_REVIEW:
      return addIdToUserArrays(newState, state, "reviews", action.payload.review.id)
    case CREATED_SPOT:
      return addIdToUserArrays(newState, state, "spots", action.payload.id)
    default:
      return state;
  }
};

export const restoreUser = () => async dispatch => {
  const answer = await fetchData("/api/session");
  if (answer.ok) dispatch(setUser(answer.user));
  return answer;
};

export default sessionReducer;
