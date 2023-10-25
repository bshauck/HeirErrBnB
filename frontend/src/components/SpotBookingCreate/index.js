import { useState } from "react" ;
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import StarRating from "../StarRating";
import { thunkReadAllSpotBookings } from "../../store/bookings";
import { thunkReadSpot } from "../../store/spots";

function SpotBookingCreate() {
    const dispatch = useDispatch()
    const { id } = useParams();
    const dateTuples = useSelector(state => state.bookings?.spot[id])
    const allBookings = useSelector(state => state.bookings.id)
    const spot = useSelector (state => state.spots.id[id])
    const [traveLInsuranceCost, setTravelInsuranceCost] = useState(0)
    const [ppn, setPpn] = useState(spot?.price || 0)
    const [nights, setNights] = useState(5)
    const [cleaningFee, setCleaningFee] = useState(160)
    const [serviceFee, setServiceFee] = useState(0)
    const [taxes, setTaxes] = useState(0)
    const [total, setTotal] = useState(0)
    const [insured, setInsured] = useState(false)
    const [errors, setErrors] = useState({})
    const [ref] = useState({b:{},s:{}});


    if (!Array.isArray(dateTuples)) {
      if (!ref.b[id]) ref.b[id] = dispatch(thunkReadAllSpotBookings(id));
      return null;
    } else if (ref.b[id]) delete ref.b[id]

    if (!spot) {
        if (!ref.s[id]) ref.s[id] = dispatch(thunkReadSpot(id));
        return null;
    } else if (ref.s[id]) delete ref.s[id]


    function handleRequestClick() { /* attempt to save */
    }

    console.log("🚀 ~ SpotBookingCreate ~ allBookings:", allBookings)
    console.log("🚀 rendering SpotBookingCreate ~ dateTuples, spot:", dateTuples, spot)


    return  (
<section>
  <div className="mainBookingCreateDiv" >
    <div className="mainBookingSubheaderDiv" >
      <h1>Request to book...</h1>
    </div>
      <div className="parentOfFloatDiv" >
        <div className="leftColumnDiv" >
          <div className="tripInfoDiv" >
            <h2>Your trip</h2>
            <div className="datesEditDiv">
              <div className="datesDiv">Dates</div>
              <a className="editAnchor" href="" >Edit</a>
            </div>
          <div className='insuranceDiv'>
            <h2>Travel Insurance</h2>
            <div className="peaceCheckBoxDiv">
              <div className="peaceOfMindDiv">Add peace of mind for <span className="insuranceCost">`${traveLInsuranceCost}`</span>
              </div>
              <input
                type="checkbox"
                checked={insured}
                onClick={e=>setInsured(e.target.checked)}
                />
              <p className="onlyAvailableP">Only available while booking.</p>
              <p className="reimbursedP">Get reimbursed if you cancel due to illness, flight delays, and more. Plus, get assistance services like emergency help.</p>
            </div>
          </div>
          <div className="requestButtonDiv">
            <button type="button" onClick={handleRequestClick}>Request to Book</button>
          </div>
        </div>
      </div>
      <div className="rightColumnDiv" >
        <div className="innerRightColumnDiv">
          <div className="spotThumbnailDiv">
            <div className="spotThumbnailImgDiv">
              <img src={spot.previewUrl} alt="location thumbnail" />
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
            <div className="leftPpnNightsRowDiv"><span className="ppnSpan">${spot.price} x {"date arithm"} nights</span></div>
            <div className="rightPpnNightsRowDiv">{`$${"calculate subtotal"}`}</div>
          </div>
          <div className="cleaningRowDiv">
            <div className="leftCleaningRowDiv"><span className="cleaningSpan">Cleaning fee</span></div>
            <div className="rightCleaningRowDiv">{`$${"calculate subtotal"}`}</div>
          </div>
            <div className="serviceRowDiv">
              <div className="leftServiceRowDiv"><span className="serviceSpan">Service fee</span></div>
              <div className="rightServiceRowDiv">{`$${"calculate subtotal"}`}</div>
            </div>
            <div className="taxesRowDiv">
              <div className="leftTaxesRowDiv"><span className="taxesSpan">Taxes</span></div>
              <div className="rightTaxesRowDiv">{`$${"calculate subtotal"}`}</div>
            </div>
            {insured && <div className="insuredRowDiv">
                <div className="leftInsuredRowDiv"><span className="insuredSpan">Insured</span></div>
                <div className="rightInsuredRowDiv">{`$${"calculate subtotal"}`}</div>
            </div>}
          </div>
        </div>
        <div className="totaledBookingDiv">
            <div className="leftTotaledBookingDiv">Total: (USD)</div>
            <div className="rightTotaledBookingDiv">${"calculate"}</div>
        </div>
      </div>
    </div>
  </div>
</div>
</section>
)};

export default SpotBookingCreate ;
