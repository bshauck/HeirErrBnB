// frontend/src/components/SpotTile/index.js
// import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './SpotTile.css';
import StarRating from '../StarRating';
import OpenModalButton from '../OpenModalButton';
import SpotDeleteFormModal from '../SpotDeleteFormModal';

function SpotTile ({spot, isManaged}) {
  const history = useHistory();
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

  return (
    <div className="tileDiv">
    {/* <img className="spotTileImg" alt="preview" src={spot.previewImage} onClick={handleTileClick}> */}
    <img className="spotTileImg" alt="preview" src="./public/bar-image-unavailable.png" onClick={handleTileClick}>
    </img>
    <div className="tileLocationAndRatingDiv">
        <span className="tileLocation">{`${spot.city}, ${spot.state}`}</span>
        <StarRating avgRating={spot.avgRating}/>
    </div>
    <div className="tilePriceDiv">${spot.price}</div>
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
