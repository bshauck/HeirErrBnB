// frontend/src/components/SpotTile/index.js
import { useState } from 'react';
import { useHistory } from 'react-router-dom/';
import { useDispatch, useSelector } from 'react-redux';

import StarRating from '../StarRating';
import OpenModalButton from '../OpenModalButton';
import SpotDeleteFormModal from '../SpotDeleteFormModal';
import { thunkReadSpot } from '../../store/spots';

const placeholderSrc = "https://placehold.co/200?text=Photo+needed&font=montserrat"

function SpotTile ({spotId, spot, isManaged}) {
  const [ref] = useState({current:{}});
  const stateSpot = useSelector(state => state.spots.id[spotId])
  const history = useHistory();
  const dispatch = useDispatch();

  if (isManaged) spot = stateSpot;

  function handleUpdateClick() {
    if (stateSpot !== true)
    history.push(`/spots/${spotId}/edit`)
  }

  function handleDeleteClick() {
  }

  function handleTileClick() {
    history.push(`/spots/${spotId}`)
  }


  if (!spot || Object.values(spot).length < 2) {
    if (!ref.current[spotId])
      ref.current[spotId] = dispatch(thunkReadSpot(spotId))
    return null;
  } else if (ref.current[spotId]) delete ref.current[spotId]

  return (
    <div className="tileDiv">
    <img className="spotTileImg" alt="preview" title={spot.name} src={spot.previewUrl || placeholderSrc} onClick={handleTileClick}>
    </img>
    <div className="tileLocationAndRatingDiv">
        <span className="tileLocation">{`${spot.city}, ${spot.state}`}</span>
        <StarRating avgRating={spot.avgRating}/>
    </div>
    <div className="tilePriceDiv">${spot.price} night</div>
    {isManaged &&
    <div className="managedTileButtonDiv">
        <button className="manageSpotUpdateButton" type="button" onClick={handleUpdateClick}>Update</button>
        <OpenModalButton
              className="manageSpotDeleteButton"
              buttonText="Delete"
              onButtonClick={handleDeleteClick}
              // onModalClose={??}
              modalComponent={<SpotDeleteFormModal id={spotId}/>}
              />
    </div>
    }
    </div>
  );
}

export default SpotTile ;
