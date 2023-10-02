/* bookings slice of state
{
    user: {
      [bookingId]: {
        bookingData,
        Spot: {
          bookingData,
        },
      },
      optionalOrderedList: [],
    },
    // Note here that your responses can actually be different here as well.
    // HINT: What information should you see if you own this booking? (Refer to API Docs).
    booking: {
      [bookingId]: {
        bookingData,
      },
      optionalOrderedList: [],
    },
}
*/

/* TODO: copy in state above, and update all api urls, etc */

import { csrfFetch } from "./csrf";

const READ_BOOKINGS = "bookings/READ_BOOKINGS";
const READ_USER_BOOKINGS = "bookings/READ_USER_BOOKINGS";
const READ_BOOKING = "bookings/READ_BOOKING";
const DELETE_BOOKING = "bookings/DELETE_BOOKING";
const CREATE_BOOKING = "bookings/CREATE_BOOKING";
const UPDATE_BOOKING = "bookings/UPDATE_BOOKING";

function readAllBookings(bookings) {
    return {
        type: READ_BOOKINGS,
        payload: bookings
    }
}

function readAllUserBookings(bookings) {
    return {
        type: READ_USER_BOOKINGS,
        payload: bookings
    }
}

function readBooking(booking) {
    return {
        type: READ_BOOKING,
        payload: booking
    }
}

function deleteBooking(id) {
    return {
        type: DELETE_BOOKING,
        payload: id
    };
};

function createBooking(booking) {
    return {
        type: CREATE_BOOKING,
        payload: booking
    };
};

function updateBooking(booking) {
    return {
        type: UPDATE_BOOKING,
        payload: booking
    }
}

export const thunkREADAllBookings = () => async (dispatch) => {
  const response = await csrfFetch("/api/bookings");
  const data = await response.json();
  dispatch(readAllBookings(data.Bookings));
  return response;
};

export const thunkREADALLUserBookings = () => async (dispatch) => {
  const response = await csrfFetch("/api/bookings/current");
  const data = await response.json();
  dispatch(readAllUserBookings(data.Bookings));
  return response;
};

export const thunkREADBooking = id => async dispatch => {
    const response = await csrfFetch(`/api/bookings/${id}`);
    const data = await response.json();
    dispatch(readBooking(id));
    return response;
};

export const thunkDELETEBooking = id => async dispatch => {
    const response = await csrfFetch(`/api/bookings/${id}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    dispatch(deleteBooking(id));
    return response;
};

export const thunkCREATEBooking = booking => async dispatch => {
  const { startDate, endDate } = booking;
  const response = await csrfFetch("/api/bookings", {
    method: "POST",
    body: JSON.stringify({ /* TODO fill out */
      startDate,
      endDate,
    }),
  });
  const data = await response.json();
  dispatch(createBooking(data.booking));
  return response;
};

export const thunkUPDATEBooking = booking => async dispatch => {
  const { startDate, endDate } = booking;
  const response = await csrfFetch(`/api/bookings/${booking.id}`, {
    method: "PUT",
    body: JSON.stringify({ /* TODO fill out */
      startDate,
      endDate,
    }),
  });
  const data = await response.json();
  dispatch(updateBooking(data.booking));
  return response;
};

const initialState = {
    user: {},
    booking: {},
};

const bookingsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case READ_BOOKINGS: {
        const bookings = action.payload;
        const normalized = {};
        bookings.forEach(s => normalized[s.id]=s)
        newState = {...state};
        newState.allBookings = bookings;
        return newState;
    }
    case READ_USER_BOOKINGS: {
        const bookings = action.payload;
        const normalized = {};
        bookings.forEach(s => normalized[s.id]=s)
        newState = {...state};
        newState.userBookings = bookings;
        return newState;
    }
    case CREATE_BOOKING:
    case READ_BOOKING:
    case UPDATE_BOOKING:
      newState = {...state};
      newState.singleBooking = action.payload;
      return newState;
    case DELETE_BOOKING:
      const newAllBookings = state.allBookings.filter(e => e.id !== action.payload);
      newState = {...state};
      newState.allBookings = newAllBookings;
      if (newState.singleBooking?.id === action.payload) newState.singleBooking = {};
      return newState;
    default:
      return state;
  }
};

export default bookingsReducer;
