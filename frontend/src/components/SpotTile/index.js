// frontend/src/components/SpotTile/index.js
import { useState } from 'react';
import { useHistory } from 'react-router-dom/';
import { useDispatch, useSelector } from 'react-redux';

import StarRating from '../StarRating';
import OpenModalButton from '../OpenModalButton';
import SpotDeleteFormModal from '../SpotDeleteFormModal';
import { thunkReadSpot } from '../../store/spots';
import { thunkReadAllUserBookings } from '../../store/bookings';



const placeholderSrc = "https://placehold.co/200?text=Photo+needed&font=montserrat"

function SpotTile ({spotId, spot, isManaged, bookingId}) {
  console.log("🚀 ~ starting SpotTile ~ spotId, spot, isManaged, bookingId:", spotId, spot, isManaged, bookingId)
  const [ref] = useState({current:{spot:null,booking:null}});
  const stateSpot = useSelector(state => state.spots.id[spotId])
  const history = useHistory();
  const dispatch = useDispatch();
  const booking = useSelector(state => state.bookings.id[bookingId])
  // const user = useSelector(state => state.session.user)

  if (bookingId) isManaged=true;
  if (isManaged) spot = stateSpot; // undefined if only bookingId

  function handleUpdateClick(e) {
    if (!bookingId) // TODO
      history.push(`/spots/${spotId}/edit`)
  }

  function handleDeleteClick() {
  }

  function handleTileClick() {
    history.push(`/spots/${spotId}`)
  }

  console.log("TEMP: ref, ref.current, ref.current.booking, ref.current.spot]", ref, ref.current, ref.current.booking, ref.current.spot)

  // console.log("TEMP: ref.current?.booking[bookingId]", ref.current?.booking)
  /* only hit db for bookingInfo if passed a bookingId */
  if (bookingId && (!booking || Object.values(booking).length < 2)) {
      if (!ref.current.booking || !ref.current.booking[bookingId])
        ref.current.booking[bookingId] = dispatch(thunkReadAllUserBookings())
      return null;
  } else if (bookingId && ref.current.booking[bookingId]) delete ref.current.booking[bookingId]

  if (!spot && !spotId) spotId = booking.spotId;

  if (!spot || Object.values(spot).length < 2) {
    if (!ref.current.spot[spotId])
      ref.current.spot[spotId] = dispatch(thunkReadSpot(spotId))
    return null;
  } else if (spotId && ref.current.spot && ref.current.spot[spotId]) delete ref.current.spot[spotId]

  console.log("🚀 ~ RENDERING SpotTile ~ spotId, spot, isManaged, bookingId:", spotId, spot, isManaged, bookingId)

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
