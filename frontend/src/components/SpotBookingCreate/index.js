import { useEffect, useState } from "react" ;
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import StarRating from "../StarRating";
import BookingCalendar from "../BookingCalendar";
import { setCreateUpdateBooking, thunkCreateBooking, thunkReadAllSpotBookings, thunkUpdateBooking } from "../../store/bookings";
import { thunkReadSpot } from "../../store/spots";
import { addDays, dayDate, dateEQ, findAvailableRange, ymd, ymdt } from '../../utils/normalizeDate';

function SpotBookingCreate({ spotId, bookingId }) {
    console.log(`starting SpotBooking ${bookingId?'Update':'Create'}`)
    const dispatch = useDispatch()
    const history = useHistory()
    const { id } = useParams();
    if (!bookingId) {
      spotId = id;
    }
    const spot = useSelector (state => state.spots.id[spotId])
    const userId = useSelector(state => state.session.user.id)
    const dates = useSelector(state => state.bookings.edit[userId])
    const dateTuples = useSelector(state => state.bookings.spot[spotId])
    const allBookings = useSelector(state => state.bookings.id)
    const bookingSpots = useSelector(state => state.bookings.spot)
    const taxRate = 0.0637;
    const insuranceRate = 0.0574;
    const serviceRate = 0.1124;
    let initialNights = 5;
    const [insured, setInsured] = useState(false)
    let booking;
    // const [nights, setNights] = useState(initialNights)
    // const [traveLInsuranceCost, setTravelInsuranceCost] = useState(0)
    // const [ppn, setPpn] = useState(spot?.price || 0)
    // const [cleaningFee, setCleaningFee] = useState(160)
    // const [serviceFee, setServiceFee] = useState(0)
    // const [taxes, setTaxes] = useState(0)
    // const [total, setTotal] = useState(0)
    const [errors, setErrors] = useState({})
    const [ref] = useState({b:{},s:{}});
// console.log("ed1: ", editDates)
    useEffect(()=>{
      if (bookingSpots !== false) console.log("bookingSpots:", Object.keys(bookingSpots))
    }, [dateTuples, dates, bookingSpots])

    let editDates;
    if (bookingId) {
      booking = allBookings[bookingId];
      editDates = [new Date(booking.startDate), new Date(booking.endDate)]
      console.log("SETTING editDates: ", editDates)
    }
    console.log("ed2: ", editDates)

    if (!Array.isArray(dateTuples)) {
      console.log("🚀 ~ SpotBookingCreate ~ dateTuples not set:", typeof dateTuples, dateTuples)
      if (!ref.b[spotId]) ref.b[spotId] = dispatch(thunkReadAllSpotBookings(spotId));
      return null;
    } else if (ref.b[spotId]) delete ref.b[spotId]

console.log("GOT past TUPLES: ", dateTuples)
    /* need tuples in either create/update case for validations */
    /* but update can ignore its own dates */
    let myTuples = dateTuples.slice();
    if (bookingId)
      myTuples.splice(myTuples.findIndex(([start, _end]) => dateEQ(dayDate(start), dayDate(booking.startDate))),1)
    let tuple = null
    let today = ymd(new Date())
    let yearOut = ymd(addDays(today, 365))
    let nights = initialNights;
    while (!tuple) {
      tuple = findAvailableRange(myTuples, nights, 7, yearOut)
      if (!--nights) break;
    }
    if (!tuple) {
      setErrors({"bookedUp":"No bookings currently available for this location"})
      editDates = [null, null]
    }
    else {
      nights++;
      editDates = tuple.map(t => new Date(t))
    }
  console.log("Initial dates: ", editDates)
  console.log("ed3: ", editDates)

  if (!spot) {
      console.log("🚀 ~ SpotBookingCreate ~ spot not set")
      if (!ref.s[spotId]) ref.s[spotId] = dispatch(thunkReadSpot(spotId));
      return null;
  } else if (ref.s[spotId]) delete ref.s[spotId]

  let ppn = spot.price,
  subtotal = ppn * nights,
  traveLInsuranceCost = Number((subtotal * insuranceRate).toFixed(2)),
        serviceFee = Number((subtotal * serviceRate).toFixed(2)),
        taxes = Number((subtotal * taxRate).toFixed(2)),
        cleaningFee = 160,
        total =
            subtotal +
            (insured*traveLInsuranceCost) +
            cleaningFee +
            serviceFee +
            taxes;

    // setTravelInsuranceCost(subtotal*insuranceRate)
    // setTaxes(subtotal*taxRate)
    // setServiceFee(subtotal*serviceRate)
function handleCalendarClick() {
    /* about to launch modal calendar, ensure store has edit data */
    if (!Array.isArray(dates)) {
        dispatch(setCreateUpdateBooking(userId, editDates));
    } else console.log("stored edit dates: ", dates)
}
async function handleRequestClick() { /* attempt to save/update */
    if (Object.values(errors).length) return;
    let validations = {}
    const thunkFunc = bookingId ? thunkUpdateBooking : thunkCreateBooking;
    console.log("Saving: dates/editDates", dates, editDates)
    const [startDate, endDate] = dates ? dates : editDates;
    console.log("Saving: start/end", startDate, endDate)
    if (startDate && endDate ) {
        if (!booking) booking = {spotId}
        booking.startDate = ymdt(startDate)
        booking.endDate = ymdt(endDate)
        console.log("trying to create booking: start/end", booking.startDate, booking.endDate)
        const answer = await dispatch(thunkFunc(booking))
        console.log("🚀 ~ handleRequestClick ~ answer:", answer)
        if (answer.errors) validations = answer.errors
        else {
            history.push("/bookings/current");
            dispatch(setCreateUpdateBooking(userId, null))
        }
    } else validations.date = "Need valid dates for booking"
    setErrors(validations)
}


console.log(`🚀 RENDERING SpotBooking ${bookingId?'UPDATE':'CREATE'} ~ dateTuples, spot, allBookings:`, dateTuples, spot, allBookings)
console.log("ed4: ", editDates)

console.log(`RENDERING SPOTBOOKING ${bookingId?'UPDATE':'CREATE'}`)

    return  (
<section>
  <div className="mainBookingCreateDiv" >
    <div className="mainBookingSubheaderDiv" >
      <h1>Request to book...</h1>
      <ul className="errors">
        {Object.values(errors).length &&
        Object.values(errors).map(e=> (
            <li key={e}>{e}</li>))}
      </ul>
    </div>
      <div className="parentOfFloatDiv" >
        <div className="leftColumnDiv" >
          <div className="tripInfoDiv" >
            <h2>Your trip</h2>
            <div className="datesEditDiv">
              <div className="datesDiv">{`${editDates[0]} - ${editDates[1]}`}</div>
              <BookingCalendar onClick={handleCalendarClick} tuples={myTuples} />
              <a className="editAnchor" href="/calendar" >Edit</a>
            </div>
          <div className='insuranceDiv'>
            <h2>Travel Insurance</h2>
            <div className="peaceCheckBoxDiv">
              <div className="peaceOfMindDiv">Add peace of mind for <span className="insuranceCost">${traveLInsuranceCost}</span>
              </div>
              <input
                type="checkbox"
                defaultChecked={insured}
                onClick={e=>setInsured(e.target.checked)}
                />
            </div>
            <p className="onlyAvailableP">Only available while booking.</p>
            <p className="reimbursedP">Get reimbursed if you cancel due to illness, flight delays, and more.<br /> Plus, get assistance services like emergency help.</p>
          </div>
          <div className="requestButtonDiv">
            <button className="requestToBookButton" type="button" onClick={handleRequestClick} >Request to Book</button>
          </div>
        </div>
      </div>
      <div className="rightColumnDiv" >
        <div className="innerRightColumnDiv">
          <div className="spotThumbnailDiv">
            <div className="spotThumbnailImgDiv">
              <img className="bookingThumbnailImg" src={spot.previewUrl} alt="location thumbnail" />
            </div>
            <div className="titleAndStarsDiv">
              <div className="spotTitle">{spot.name}</div>
              <div className="starsDiv"><StarRating className="createBookingStarRating" avgRating={spot.avgRating} numReviews={spot.numReviews} />
            </div>
          </div>
        </div>
        <div className="priceDetailsDiv">
        <div className="innerPriceDetailsDiv">
          <h2>Price details</h2>
          <div className="ppnNightsRowDiv">
            <div className="leftPpnNightsRowDiv"><span className="ppnSpan">${spot.price} x {nights} nights</span></div>
            <div className="rightPpnNightsRowDiv">${subtotal.toFixed(2)}</div>
          </div>
          <div className="cleaningRowDiv">
            <div className="leftCleaningRowDiv"><span className="cleaningSpan">Cleaning fee</span></div>
            <div className="rightCleaningRowDiv">${cleaningFee.toFixed(2)}</div>
          </div>
            <div className="serviceRowDiv">
              <div className="leftServiceRowDiv"><span className="serviceSpan">Service fee</span></div>
              <div className="rightServiceRowDiv">${serviceFee.toFixed(2)}</div>
            </div>
            <div className="taxesRowDiv">
              <div className="leftTaxesRowDiv"><span className="taxesSpan">Taxes</span></div>
              <div className="rightTaxesRowDiv">${taxes.toFixed(2)}</div>
            </div>
            {insured && <div className="insuredRowDiv">
                <div className="leftInsuredRowDiv"><span className="insuredSpan">Travel Insurance<br /></span><span className="insuranceSubttextSpan" >Assistance services fee included</span></div>
                <div className="rightInsuredRowDiv">${traveLInsuranceCost}</div>
            </div>}
          </div>
        </div>
        <div className="totaledBookingDiv">
            <div className="leftTotaledBookingDiv">Total: (USD)</div>
            <div className="rightTotaledBookingDiv">${total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  </div>
</div>
</section>
)};

export default SpotBookingCreate ;
