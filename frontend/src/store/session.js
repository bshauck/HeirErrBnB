/* session slice of state with user
{
  user: {
    id,
    email,
    username,
    firstName,
    lastName,
    createdAt,
    updatedAt
  }
}

and without user

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

export default sessionReducer;
