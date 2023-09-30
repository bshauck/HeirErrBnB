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

import { csrfFetch } from "./csrf";
import { READ_SPOT } from "./spots";

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

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  if (response.status >= 400)
    throw response;
  const data = await response.json();
  // if (data && data?.errors)
  //   throw data;
  dispatch(setUser(data.user));
  return response;
};
export const thunkLogin=login;

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};
export const thunkSignup = signup;

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
};
export const thunkLogout = logout;

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  const newState = {...state};
  switch (action.type) {
    case SET_USER:
      const newUser = action.payload
      newState.user = newUser;
      if (!state[newUser.id]?.username) /* didn't have full user info */
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
