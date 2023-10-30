import { useParams } from "react-router-dom"
import SpotBookingCreate from "../SpotBookingCreate";

function SpotBookingUpdate () {
    const { spotId, bookingId } = useParams()

    return <SpotBookingCreate spotId={spotId} bookingId={bookingId} />
}

export default SpotBookingUpdate;
