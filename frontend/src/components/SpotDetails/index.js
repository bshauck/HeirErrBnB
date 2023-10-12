// frontend/src/components/SpotDetails/index.js
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { thunkReadSpot } from "../../store/spots";
import StarRating from "../StarRating";
import SpotDetailReviewArea from "../SpotDetailReviewArea";

function SpotDetails() {
    const { id } = useParams();
    const spot = useSelector(state => state.spots.id[id])
    const imageIds = useSelector(state => state.spots.id[id]?.images)
    const dispatch = useDispatch();
    const otherImages = [];
    const spotImages = useSelector(state => state.spotImages);
    console.log("🚀 ~ file: index.js:15 ~ SpotDetails ~ spotImages:", spotImages)




  const ref = useRef({});
  if (!imageIds) {
    if (!ref.current[id]) ref.current[id] = dispatch(thunkReadSpot(id))
    return null;
  } else if (ref.current[id]) delete ref.current[id]

  for (const imageId in imageIds)
  otherImages.push(spotImages[imageId])

  const owner = spot?.Owner;
  function handleReserveClick(){
      alert("Feature Coming Soon...")
  }

  return (
    <div className="spotDetailsDiv">
        <h1>{spot.name}</h1>
        <div className="spotDetailsLocationDiv">{spot.city}, {spot.state}, {spot.country}</div>
        <div className="spotDetailsImagesDiv">
            <div className="spotDetailsPreviewDiv"><img className="spotDetailsPreviewImg" alt='preview' src={spot.previewUrl}></img></div>
            <div className="spotDetailsImagesDiv">
                {otherImages && otherImages.length && otherImages.map((url,i) => (
                    <img key={i} className="spotDetailsSmallImg" alt='' src={url}></img>
                ))
                }
            </div>
        </div>
        <section>
            <h2>{`Hosted by ${owner?.firstName} ${owner?.lastName}`}</h2>
            <p>Wonderful description of unbelievably glowing qualities of our beneficent host</p>
            <div className="spotDetailsCalloutDiv">
                <div className="spotDetailsPriceDiv">{`$ ${spot.price} night`}</div>
                <StarRating className="spotDetailsCalloutRating" avgRating={spot.avgRating} numReviews={spot.numReviews} />
                <button className="reserveButton" onClick={handleReserveClick}>Reserve</button>
            </div>
            <hr></hr>
        </section>
        <SpotDetailReviewArea spot={spot} />
    </div>
    )
};

export default SpotDetails ;
