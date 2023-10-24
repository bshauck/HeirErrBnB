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

import { csrfFetch, fetchData } from "./csrf";
import { CREATED_REVIEW, CREATED_SPOT, DELETED_REVIEW, DELETED_SPOT, READ_SPOT, READ_SPOT_REVIEWS, READ_USER_BOOKINGS, READ_USER_REVIEWS, READ_USER_SPOTS } from "./commonActionCreators";

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

const initialState = {
  user: null,
  id: {},
  spots:null,
  reviews:null,
  bookings:null,
 };

const sessionReducer = (state = initialState, action) => {
  const newState = {...state};

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
      newState.id = {...state.id}
      newState.id[userId] = partialUser;
      return newState;
    }
    case READ_SPOT_REVIEWS: {
      const {reviews} = action.payload
      const partialUsers = reviews.map(pu => pu.User);
      if (partialUsers.every(pu => state.id[pu.id])) return state;
      newState.id = {...state.id}
      partialUsers.forEach(pu => newState.id[pu.id] = pu)
      return newState;
    }
    case REMOVE_USER: /* don't remove key; names still used in spot details */
      newState.user = newState.reviews = newState.spots = newState.bookings = null;
      return newState;

    case READ_USER_BOOKINGS: {
      if (!action.payload) return state;
      const bookingIds = action.payload.map(b => b.id)
      newState.user = {...state.user}
      newState.id = {...state.id}
      newState.id[state.user.id].bookings = newState.bookings = newState.user.bookings = bookingIds
      return newState
    }
    case READ_USER_REVIEWS: {
      const reviewIds = action.payload.map(r => r.id)
      newState.user = {...state.user}
      newState.id = {...state.id}
      newState.id[state.user.id].reviews = newState.reviews = newState.user.reviews = reviewIds
      return newState
    }
    case READ_USER_SPOTS: {
      const spotIds = action.payload.map(s=>s.id)
      newState.user = {...state.user}
      newState.id = {...state.id}
      newState.id[state.user.id].spots = newState.spots = newState.user.spots = spotIds;
      return newState;
    }
    case DELETED_SPOT: {
      newState.user = {...state.user}
      const index = state.spots.indexOf(action.payload.id)
      if (index === -1) return state
      newState.spots = newState.user.spots = [...state.spots]
      newState.spots.splice(index, 1)
      return newState
    }
    case DELETED_REVIEW: {
      newState.user = {...state.user}
      const index = state.reviews.indexOf(action.payload.reviewId)
      if (index === -1) return state;
      newState.reviews = newState.user.reviews = [...state.reviews]
      newState.reviews.splice(index, 1)
      return newState
    }
    case CREATED_REVIEW: {
      newState.user = {...state.user}
      const old = state.reviews ?? []
      newState.reviews = newState.user.reviews = [...old, action.payload.review.id]
      return newState
    }
    case CREATED_SPOT: {
      newState.user = {...state.user}
      const old = state.spots ?? []
      newState.spots = newState.user.spots = [...old, action.payload.id]
      return newState
    }
    default:
      return state;
  }
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export default sessionReducer;
