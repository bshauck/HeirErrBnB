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

import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
    console.log("🚀 ~ file: session.js:28 ~ setUser ~ user:", user)

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
    console.log("🚀 ~ file: session.js:41 ~ login ~ user:", user)

  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
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
  console.log("🚀 ~ file: session.js:61 ~ sessionReducer ~ action:", action)
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = {...state};
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = {...state};
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
