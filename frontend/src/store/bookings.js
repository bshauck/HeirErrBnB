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
  edit: { [userId]: null | [startDate | null, endDate | null], }
  spot: { [spotId]: [[start,end],[start,end],], }
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
const SET_CREATE_UPDATE_BOOKING = "bookings/SET_CREATE_UPDATE_BOOKING"


export function setCreateUpdateBooking(userId, dates) {
    return {
        type: SET_CREATE_UPDATE_BOOKING ,
        payload: {userId, dates}
    }
}

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

export const thunkReadUserBookings = () => async dispatch => {
  console.log("🚀 ~ entering thunkReadUserBookings ~");
  let bookings = await fetchData("/api/bookings/current");
  console.log("🚀 ~ thunkReadUserBookings ~ bookings:", bookings)
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
  console.log("🚀 ~ thunkCreateBooking ~ booking:", booking)

  const { spotId } = booking;
  if (!spotId) throw new Error ("booking without spotId")
  const answer = await fetchData(`/api/spots/${spotId}/bookings`, {
    method: "POST",
    body: JSON.stringify(booking),
  });
  if (!answer.errors) {
    console.log("🚀 ~ thunkCreateBooking ~ answer:", answer)
    dispatch(createdBooking(answer));
  } else console.log("🚀 ~ thunkCreateBooking ~ answer.errors:", answer.errors)
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
  edit: {}, // on create/update put [userId]: {spotId: spotId, dates: [null,null]}, for dates
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
    if (state.user[userId])
      newState.user[userId] = [...state.user[userId], id]
    else newState.user[userId] = [id];
    return newState;
  }
  case UPDATED_BOOKING:{
      const id = action.payload.id;
      newState.id = {...state.id}
      newState.id[id] = {...state.id[id], ...action.payload}
      return newState;
    }
    case DELETED_BOOKING: {
      console.log("DELETED BOOKING id", action.payload)
      const oldBookingId = action.payload
      const oldSpotId = state.id[oldBookingId].spotId;
      const oldUserId = state.id[oldBookingId].userId;
      const oldStartDate = state.id[oldBookingId].startDate;

      if (state.spot[oldSpotId]) {
        newState.spot = {...state.spot}
        newState.spot[oldSpotId] = [...state.spot[oldSpotId]]
        newState.spot[oldSpotId].splice(newState.spot[oldSpotId]).findIndex(subarr => subarr[0]=== oldStartDate, 1)
      }

      if (state.user[oldUserId]) {
        newState.user = {...state.user}
        newState.user[oldUserId] = [...state.user[oldUserId]]
        newState.user[oldUserId].splice(newState.user[oldUserId].indexOf(oldBookingId), 1)
      }

      newState.id = {...state.id};
      delete newState.id[oldBookingId];
      return newState;
    }
    case SET_CREATE_UPDATE_BOOKING: {
      const { userId, dates} = action.payload
      newState.edit = {...state.edit}
      newState.edit[userId] = Array.isArray(dates) && dates.length
        ? [dates[0], dates[1]]
        : dates
      return newState
    }
    default:
      return state;
  }
};

export default bookingsReducer;
