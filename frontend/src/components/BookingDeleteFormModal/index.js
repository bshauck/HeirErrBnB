// frontend/src/components/BookingDeleteFormModal/index.js

import { thunkDeleteBooking } from "../../store/bookings";

function BookingDeleteFormModal({ id }) {
  return <ResourceDeleteFormModal id={id} resource="booking" thunkDeleteFunc={thunkDeleteBooking} />
}

export default BookingDeleteFormModal;
