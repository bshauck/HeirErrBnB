// frontend/src/components/SpotTile/index.js
// import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import StarRating from '../StarRating';
import OpenModalButton from '../OpenModalButton';
import SpotDeleteFormModal from '../SpotDeleteFormModal';
import { useDispatch, useSelector } from 'react-redux';
import { thunkREADSpot } from '../../store/spots';

const placeholderSrc = "https://placehold.co/100?text=Photo+needed&font=montserrat"

function SpotTile ({spot, isManaged}) {
  const stateSpot = useSelector(state => state.spots.allSpots[spot.id])
  const history = useHistory();
  const dispatch = useDispatch();
  console.log("🚀 ~ file: index.js:7 ~ SpotTile ~ isManaged:", isManaged)
  console.log("🚀 ~ file: index.js:7 ~ SpotTile ~ spot:", spot)
  // const sessionUser = useSelector(state => state.session.user);


  function handleUpdateClick() {
    history.push(`/spots/${spot.id}/edit`)
  }

  function handleDeleteClick() {
  }

  function handleTileClick() {
    history.push(`/spots/${spot.id}`)
  }

  if (!stateSpot) {
    (async()=>await(dispatch(thunkREADSpot(spot.id))))()
    return null;
  }
  return (
    <div className="tileDiv">
    <img className="spotTileImg" alt="preview" src={spot.previewImage || placeholderSrc} onClick={handleTileClick}>
    </img>
    <div className="tileLocationAndRatingDiv">
        <span className="tileLocation">{`${spot.city}, ${spot.state}`}</span>
        <StarRating avgRating={spot.avgRating}/>
    </div>
    <div className="tilePriceDiv">${spot.price} night</div>
    {isManaged &&
    <div className="managedTileButtonDiv">
        <button type="button" onClick={handleUpdateClick}>Update</button>
        <OpenModalButton
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
