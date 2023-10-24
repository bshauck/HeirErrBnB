/* bookings slice of state
{
  id:
    {
      [bookingId]:
        {
          id,
          userId,
          spotId,
          startDate,
          endDate,
          createdAt,
          updatedAt
        },
    }
  spot: { [spotId]: [idsOrderedBySpotAndAscFutureEndDatePerhaps], }
  user: { [userId]: [idsOrderedByUserAndAscFutureEndDatePerhaps], }
}
*/
import { fetchData } from "./csrf";
import { CREATED_BOOKING, DELETED_BOOKING, READ_SPOT_BOOKINGS, READ_USER_BOOKINGS } from "./commonActionCreators";

/*
GetCurrentUser:
  GET /api/bookings/current
GetAllSpotBookings
  GET /api/spots/:id/bookings
CreateSpotBooking
  POST /api/spots/:id/bookings (start/end)
EditBooking
  PUT /api/bookings/:id (start/end)
DeleteBooking
  DEL /api/bookings/:id
    toISOString().split('T')[0];


*/

// const READ_BOOKING = "bookings/READ_BOOKING";
const UPDATED_BOOKING = "bookings/UPDATED_BOOKING";

function readAllSpotBookings(bookings, spotId) {
    return {
        type: READ_SPOT_BOOKINGS,
        payload: {bookings, spotId}
    }
}

function readAllUserBookings(bookings) {
    return {
        type: READ_USER_BOOKINGS,
        payload: bookings
    }
}

// function readBooking(booking) {
//     return {
//         type: READ_BOOKING,
//         payload: booking
//     }
// }

function deletedBooking(id) {
    console.log("🚀 ~ deletedBooking ~ id:", id)
    return {
        type: DELETED_BOOKING,
        payload: id
    };
};

function createdBooking(booking) {
    return {
        type: CREATED_BOOKING,
        payload: booking
    };
};

function updatedBooking(booking) {
    return {
        type: UPDATED_BOOKING,
        payload: booking
    }
}

export const thunkReadAllSpotBookings = () => async (dispatch) => {
  const response = await fetchData("/api/bookings");
  const data = await response.json();
  dispatch(readAllSpotBookings(data.Bookings));
  return response;
};

export const thunkReadAllUserBookings = () => async (dispatch) => {
  console.log("🚀 ~ entering thunkReadAllUserBookings ~");
  const answer = await fetchData("/api/bookings/current");
  console.log("🚀 ~ thunkReadAllUserBookings ~ answer:", answer)
  if (answer && !answer.errors && answer.Bookings) {
    console.log("DISPATCHING user bookings: answer", answer)
    dispatch(readAllUserBookings(answer.Bookings));
  } else console.log("NOT dispatching user bookings: answer", answer)
  return answer;
};

// export const thunkReadBooking = id => async dispatch => {
//     const answer = await fetchData(`/api/bookings/${id}`);
//     if (!answer.errors) dispatch(readBooking(id));
//     return answer;
// };

export const thunkDeleteBooking = id => async dispatch => {
    console.log("🚀 ~ thunkDeleteBooking ~ id:", id)
    const answer = await fetchData(`/api/bookings/${id}`, { method: 'DELETE' });
    console.log("🚀 ~ thunkDeleteBooking ~ answer, errors:", answer, answer.errors)
    if (!answer.errors) dispatch(deletedBooking(id));
    return answer;
};

export const thunkCreateBooking = booking => async dispatch => {
  const { startDate, endDate } = booking;
  const response = await fetchData("/api/bookings", {
    method: "POST",
    body: JSON.stringify({ /* TODO fill out */
      startDate,
      endDate,
    }),
  });
  const data = await response.json();
  dispatch(createdBooking(data.booking));
  return response;
};

export const thunkUpdateBooking = booking => async dispatch => {
  const { startDate, endDate } = booking;
  const response = await fetchData(`/api/bookings/${booking.id}`, {
    method: "PUT",
    body: JSON.stringify({ /* TODO fill out */
      startDate,
      endDate,
    }),
  });
  const data = await response.json();
  dispatch(updatedBooking(data.booking));
  return response;
};

const initialState = {
  id: {},
  spot: {}, // or spotId=>bookingIdsArray
  user: {} // or userId=>bookingIdsArray
};

const bookingsReducer = (state = initialState, action) => {
  if (!action.type.startsWith('@@'))
    console.log("🚀 ~ bookingsReducer ~ type, payload:", action.type, action.payload)
  let newState = {...state};
  switch (action.type) {
    case READ_SPOT_BOOKINGS: {
        const bookings = action.payload;
        if (!bookings || !bookings.length) return state;
        const normalized = {};
        bookings.forEach(s => normalized[s.id]=s)
        newState.spot = {...state.spot}
        newState.spot[bookings[0].spotId] = Object.keys(normalized);
        return newState;
    }
    case READ_USER_BOOKINGS: {
        const bookings = [...action.payload];
        if (!bookings || !bookings.length) return state;
        const normalized = {};
        bookings.forEach(b => normalized[b.id]=b)
        newState.id = {...state.id, ...normalized};
        newState.user = {...state.user}
        newState.user[bookings[0].userId] = Object.keys(normalized);
        return newState;
    }
    // case READ_BOOKING:
    case CREATED_BOOKING:{
    const id = action.payload.id;
    const userId = action.payload.userId;
    const spotId = action.payload.spotId;
    newState.id = {...state.id}
    newState.id[id] = {...action.payload}
    newState.user = {...state.user}
    newState.user[userId] = [...state.user[userId], id]
    newState.spot = {...state.spot}
    newState.spot[spotId] = [...state.spot[spotId], id]
    return newState;
  }
  case UPDATED_BOOKING:{
      const id = action.payload.id;
      newState.id = {...state.id}
      newState.id[id] = {...state.id[id], ...action.payload}
      return newState;
    }
    case DELETED_BOOKING: {
      console.log("DELETING BOOKING id", action.payload)
      const oldBookingId = action.payload
      if (!Object.keys(state.id).includes(oldBookingId)) return state;
      const oldSpotId = state.id[oldBookingId].spotId;
      const oldUserId = state.id[oldBookingId].userId;
      newState.id = {...state.id};
      delete newState.id[oldBookingId]
      newState.spot = {...state.spot}
      newState.spot[oldSpotId] = [...state.spot[oldSpotId]]
      newState.spot[oldSpotId].splice(newState.spot[oldSpotId].indexOf(oldBookingId),1)
      newState.user = {...state.user}
      newState.user[oldUserId] = [...state.user[oldUserId]]
      newState.user[oldUserId].splice(newState.user[oldUserId].indexOf(oldBookingId), 1)
      return newState;
    }
    default:
      return state;
  }
};

export default bookingsReducer;
