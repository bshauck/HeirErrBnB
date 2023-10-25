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
  POST /api/spots/:id/bookings (userId/start/end)
EditBooking
  PUT /api/bookings/:id (start/end)
DeleteBooking
  DEL /api/bookings/:id
    toISOString().split('T')[0];


*/

// const READ_BOOKING = "bookings/READ_BOOKING";
const UPDATED_BOOKING = "bookings/UPDATED_BOOKING";

function readAllSpotBookings(payload) {
    return {
        type: READ_SPOT_BOOKINGS,
        payload // bookings, spotId
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

export const thunkReadAllSpotBookings = spotId => async dispatch => {
  console.log("🚀 ~ thunkReadAllSpotBookings ~ spotId:", spotId)
  let bookings = await fetchData(`/api/spots/${spotId}/bookings`);
  if (!bookings.errors) {
    bookings = bookings.Bookings;
    dispatch(readAllSpotBookings({bookings, spotId}));
  console.log("🚀 ~ thunkReadAllSpotBookings ~ bookings:", bookings)
  }
  return bookings;
};

export const thunkReadAllUserBookings = () => async dispatch => {
  console.log("🚀 ~ entering thunkReadAllUserBookings ~");
  let bookings = await fetchData("/api/bookings/current");
  console.log("🚀 ~ thunkReadAllUserBookings ~ bookings:", bookings)
  if (!bookings.errors) {
    bookings = bookings.Bookings;
    console.log("DISPATCHING user bookings: bookings", bookings)
    dispatch(readAllUserBookings(bookings));
  } else console.log("NOT dispatching user bookings: bookings", bookings)
  return bookings;
};

export const thunkDeleteBooking = id => async dispatch => {
    console.log("🚀 ~ thunkDeleteBooking ~ id:", id)
    const answer = await fetchData(`/api/bookings/${id}`, { method: 'DELETE' });
    console.log("🚀 ~ thunkDeleteBooking ~ answer, errors:", answer, answer.errors)
    if (!answer.errors) dispatch(deletedBooking(id));
    return answer;
};

export const thunkCreateBooking = booking => async dispatch => {
  const { spotId } = booking;
  const answer = await fetchData(`/api/spots/${spotId}/bookings`, {
    method: "POST",
    body: JSON.stringify(booking),
  });
  if (!answer.errors) dispatch(createdBooking(answer));
  return answer;
};

export const thunkUpdateBooking = booking => async dispatch => {
  // const { startDate, endDate } = booking;
  const answer = await fetchData(`/api/bookings/${booking.id}`, {
    method: "PUT",
    body: JSON.stringify(booking),
  });
  if (!answer.errors) dispatch(updatedBooking(answer));
  return answer;
};

const initialState = {
  id: {},
  spot: {}, // or spotId=>DateTupleArray
  user: {} // or userId=>bookingIdsArray
};

const bookingsReducer = (state = initialState, action) => {
  // if (!action.type.startsWith('@@'))
    console.log("🚀 ~ bookingsReducer ~ type, payload:", action.type, action.payload)
  let newState = {...state};
  switch (action.type) {
    case READ_SPOT_BOOKINGS: { // just dates, no id
        const { bookings, spotId } = action.payload;
        console.log("🚀 ~ readspotbookings in reducer ~ bookings, spotId:", bookings, spotId)
        if (!bookings || !bookings.length) return state;
        newState.spot = {...state.spot, [spotId]:[]}
        bookings.forEach(b => newState.spot[spotId].push([b.startDate,b.endDate]))
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
    newState.id = {...state.id}
    newState.id[id] = {...action.payload}
    newState.user = {...state.user}
    newState.user[userId] = [...state.user[userId], id]
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
      const oldSpotId = state.id[oldBookingId].spotId;
      const hasBookingId = Object.keys(state.id).includes(oldBookingId)
      const hasSpotId = Object.keys(state.spot).includes(oldSpotId)
      if (!hasBookingId && !hasSpotId) return state;
      if (hasBookingId) {
        newState.id = {...state.id};
        delete newState.id[oldBookingId];
      }
      if (hasSpotId) {
        newState.spot = {...state.spot}
        delete newState.spot[oldSpotId]
      }
      const oldUserId = state.id[oldBookingId].userId;
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
