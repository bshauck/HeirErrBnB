// frontend/src/components/SpotTile/index.js
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import StarRating from '../StarRating';
import OpenModalButton from '../OpenModalButton';
import SpotDeleteFormModal from '../SpotDeleteFormModal';
import { useDispatch, useSelector } from 'react-redux';
import { thunkReadSpot } from '../../store/spots';

const placeholderSrc = "https://placehold.co/100?text=Photo+needed&font=montserrat"

function SpotTile ({spot, isManaged}) {
  const stateSpot = useSelector(state => state.spots.id[spot.id])
  const history = useHistory();
  const dispatch = useDispatch();


  function handleUpdateClick() {
    history.push(`/spots/${spot.id}/edit`)
  }

  function handleDeleteClick() {
  }

  function handleTileClick() {
    history.push(`/spots/${spot.id}`)
  }

  if (!stateSpot) {
    (async()=>await(dispatch(thunkReadSpot(spot.id))))()
    return null;
  }
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
              modalComponent={<SpotDeleteFormModal id={spot.id}/>}
              />
    </div>
    }
    </div>
  );
}

export default SpotTile ;
