// frontend/src/components/SpotTile/index.js
import { useState } from 'react';
import { useHistory } from 'react-router-dom/';
import { useDispatch, useSelector } from 'react-redux';

import StarRating from '../StarRating';
import OpenModalButton from '../OpenModalButton';
import SpotDeleteFormModal from '../SpotDeleteFormModal';
import { thunkReadSpot } from '../../store/spots';
import { thunkReadAllUserBookings } from '../../store/bookings';
import { ymd } from '../../utils/normalizeDate'


const placeholderSrc = "https://placehold.co/200?text=Photo+needed&font=montserrat"

function SpotTile ({spotId, spot, isManaged, bookingId}) {
  console.log("🚀 ~ starting SpotTile ~ spotId, spot, isManaged, bookingId:", spotId, spot, isManaged, bookingId)
  const [ref] = useState({current:{spot:{},booking:{}}});
  const stateSpots = useSelector(state => state.spots.id)
  const history = useHistory();
  const dispatch = useDispatch();
  const booking = useSelector(state => state.bookings.id[bookingId])
  // const user = useSelector(state => state.session.user)

  if (booking) {
    spotId = booking.spotId;
    spot = stateSpots[spotId]
  } else if (!spot) {
    spot = stateSpots[spotId]
  }

  function handleUpdateClick(e) {
    if (!bookingId) // TODO
      alert("need to invoke calendar")
  }

  function handleDeleteClick() {
  }

  function handleTileClick() {
    history.push(`/spots/${spotId}`)
  }

  /* only hit db for bookingInfo if passed a bookingId */
  if (bookingId && (!booking || Object.values(booking).length < 2)) {
      if (!ref.current.booking || !ref.current.booking[bookingId])
        ref.current.booking[bookingId] = dispatch(thunkReadAllUserBookings())
      return null;
  } else if (bookingId && ref.current.booking && ref.current.booking[bookingId]) delete ref.current.booking[bookingId]

  if (!spot || Object.values(spot).length < 2) {
    if (!ref.current.spot || !ref.current.spot[spotId])
      ref.current.spot[spotId] = dispatch(thunkReadSpot(spotId))
    return null;
  } else if (spotId && ref.current.spot && ref.current.spot[spotId]) delete ref.current.spot[spotId]

  console.log("🚀 ~ RENDERING SpotTile ~ spotId, spot, isManaged, bookingId, booking:", spotId, spot, isManaged, bookingId, booking)

  return (
    <>
    <div className="tileDiv"> <div className="tileNoButtonsDiv" onClick={handleTileClick} >
    <img className="spotTileImg" alt="preview" title={spot.name} src={spot.previewUrl || placeholderSrc} >
    </img>
    <div className="tileLocationAndRatingDiv">
        <span className="tileLocation">{`${spot.city}, ${spot.state}`}</span>
        <StarRating avgRating={spot.avgRating}/>
    </div>
    <div className="tilePriceDiv"><span className="tilePriceSpan">${spot.price}</span> night</div></div>
    {booking &&
    <div className="bookingDateRange" >
      <span>{`${ymd(booking.startDate)} to ${ymd(booking.endDate)}`}</span>
    </div>}

    {isManaged &&
    <div className="managedTileButtonDiv">
        <button className="manageSpotUpdateButton" type="button" onClick={handleUpdateClick}>Update</button>
        <OpenModalButton
              className="manageSpotDeleteButton"
              buttonText="Delete"
              onButtonClick={handleDeleteClick}
              // onModalClose={??}
              modalComponent={<SpotDeleteFormModal id={spotId}/>}
              />    </div>
    }
  </div>
    </>
  );
}

export default SpotTile ;
