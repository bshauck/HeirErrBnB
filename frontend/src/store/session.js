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
 * entry point, and besides the "user" key for the current
 * user, I will have user id keys and user data per user
 * mainly to have owner info for spots, but will fill other
 * stuff as gathered. So:
 * userId: {user data} for each user encountered
 * So other user data will exist in two possible states
 *

 * userId: { // obtained from singleSpot
    id,
    firstName,
    lastName,
  }
 * userId: { // obtained from valid login
    id,
    email,
    username,
    firstName,
    lastName,
    createdAt,  /// TODO?
    updatedAt   /// TODO?
  }
 *
 */

import { csrfFetch, fetchData } from "./csrf";
import { READ_SPOT, READ_USER_REVIEWS } from "./commonActionCreators";

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
  id: {}
 };

const sessionReducer = (state = initialState, action) => {
  const newState = {...state};
  switch (action.type) {
    case SET_USER:
      const newUser = action.payload
      newState.user = newUser;
      if (newUser && !state[newUser.id]?.username) /* didn't have full user info */
        newState[newUser.id] = newUser;
      return newState;
    case READ_SPOT:
      const partialUser = action.payload.Owner;
      if (state[partialUser.id]) return state; /* already have this */
      newState[partialUser.id] = partialUser;
      return newState;
    case REMOVE_USER: /* don't remove key; names still used in spot details */
      newState.user = null;
      return newState;
    case READ_USER_REVIEWS:
      const reviews = action.payload.map(r => r.id)
      console.log("🚀 ~ file: session.js:137 ~ sessionReducer ~ reviews:", reviews)
      console.log("🚀 ~ file: session.js:137 ~ sessionReducer ~ action.payload:", action.payload)
      const updatedUser = {...state.user, reviews}
      console.log("🚀 ~ file: session.js:140 ~ sessionReducer ~ updatedUser:", updatedUser)
      newState.user = updatedUser
      newState.id[updatedUser.id] = updatedUser
      return newState
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
