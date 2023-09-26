// frontend/src/components/SpotTile/index.js
// import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import './SpotTile.css';
import StarRating from '../StarRating';

function SpotTile ({spot, isManaged}) {
  const history = useHistory();
  console.log("🚀 ~ file: index.js:7 ~ SpotTile ~ isManaged:", isManaged)
  console.log("🚀 ~ file: index.js:7 ~ SpotTile ~ spot:", spot)
  // const sessionUser = useSelector(state => state.session.user);

  function handleClick() {
    history.push(`/spots/${spot.id}`)
  }

  return (
    <div className="tileDiv">
    <img className="spotTileImg" alt="preview" src={spot.previewUrl} onClick={handleClick}>
    </img>
    <div className="tileLocationAndRatingDiv">
        <div className="tileLocation">{`${spot.city}, ${spot.state}`}</div>
        <div className="tileStarRatingDiv"><StarRating avgRating={spot.avgRating} numReviews={spot.numReviews}/></div>
    </div>
    <div className="tilePriceDiv">${spot.price}</div>
    {isManaged &&
    <div className="managedTileButtonDiv">
        <button type="button" onClick={alert(`update spot ${spot.id} clicked`)}>Update</button>
        <button type="button" onClick={alert(`delete spot ${spot.id} clicked`)}>Delete</button>
    </div>
    }
    </div>
  );
}

export default SpotTile ;
