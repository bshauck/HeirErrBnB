// frontend/src/components/ManageBookings/index.js
// import { useState } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { thunkReadAllUserBookings } from '../../store/bookings';
import SpotTile from '../SpotTile';

const ManageBookings = () => {
    const user = useSelector(state => state.session.user);
    const bookingIds = useSelector(state => state.session.bookings)
    const dispatch = useDispatch();
    const history = useHistory();

    function handleClick() { /* search goes to landing */
      history.push("/")
    }

    if (!user || !user.id) throw new Error("bad user info")

    const [ref] = useState({current:{}});
    if (!bookingIds || !Array.isArray(bookingIds)) {
      if (!ref.current[user.id]) ref.current[user.id] = dispatch(thunkReadAllUserBookings());
      return null;
    } else if (ref.current[user.id]) delete ref.current[user.id]

    console.log("🚀 ~ RENDERING ManageBookings ~ bookingIds:", bookingIds)

    return (
      <div className="ManageBookingsDiv">
        <div className="ManageBookingsHeaderDiv">
          <h1>Trips</h1>
        </div>
        {bookingIds.length ?
          <div className="spotListDiv">
          {bookingIds.map(bId => (
            <SpotTile key={bId} isManaged={true} bookingId={bId} />))}
        </div>
        :
        <div className="emptyBookingsDiv">
          <h2>No trips booked...yet!</h2>
          <p>Time to dust off your bags and start planning your next adventure</p>
          <button className="emptyBookingButton" type="button" onClick={handleClick} >Start searching</button>
        </div>
        }
      </div>
    );
}

export default ManageBookings ;
