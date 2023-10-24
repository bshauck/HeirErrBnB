import { useState } from "react" ;
import { useSelector } from "react-redux";
import { thunkReadAllSpotBookings } from "../../store/bookings";


function SpotBookingCreate({ spot }) {
    const bookingIds = useSelector(state => state.spots.id[spot.id].bookings)
    const allBookings = useSelector(state => state.bookings.id)

    const [ref] = useState({current:{}});
    if (!bookingIds || !Array.isArray(bookingIds)) {
      if (!ref.current[spot.id]) ref.current[spot.id] = dispatch(thunkReadAllSpotBookings());
      return null;
    } else if (ref.current[spot.id]) delete ref.current[spot.id]



    const bookings = bookingIds.map(id => allBookings[id])
    console.log("🚀 rendering SpotBookingCreate ~ bookings:", bookings)


    return (
        <>
        <div className="mainBookingCreateDiv">
            <div className="mainBookingSubheaderDiv">
                <h1>Request to book...</h1>




            </div>
        </div>
        </>
    )
};

export default SpotBookingCreate ;
