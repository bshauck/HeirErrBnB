// frontend/src/components/SpotDetails/index.js
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { thunkReadSpot } from "../../store/spots";
import StarRating from "../StarRating";
import SpotDetailReviewArea from "../SpotDetailReviewArea";

function SpotDetails() {
    const { id } = useParams();
    console.log("🚀 ~invoking SpotDetails ~ id:", id)
    const [ref] = useState({current:{}});
    const spot = useSelector(state => state.spots.id[id])
    const imageIds = useSelector(state => state.spots.id[id]?.images)
    const dispatch = useDispatch();
    const spotImages = useSelector(state => state.spotImages.id);
    let otherImages = []
    console.log("🚀 ~ file: index.js:15 ~ SpotDetails ~ id, spotImages, imageIds, spot:", id, spotImages, imageIds, spot);
    // const [rerender, setRerender] = useState({})
    const placeholderSrc = "https://placehold.co/200?text=Photo+needed&font=montserrat"


  if (!imageIds) {
      if (!ref.current[id]) {
          ref.current[id] = true;
        console.log(`thunkReadSpot(${id}) going to invoked`)
        dispatch(thunkReadSpot(id))
    }
    return null;
  } else if (ref.current[id]) delete ref.current[id]

  for (const imageId of imageIds)
    otherImages.push(spotImages[imageId])
  if (otherImages.length > 4)
    otherImages = otherImages.slice(0,4)
  while (otherImages.length < 4)
    otherImages.push({id: placeholderSrc+otherImages.length.toString(), url:placeholderSrc})

  const owner = spot.Owner;
  function handleReserveClick(){
      alert("Feature Coming Soon...")
  }

  console.log("rendering SpotDetails")

  return (
    <div className="spotDetailsDiv">
        <h1>{spot.name}</h1>
        <div className="spotDetailsLocationDiv">{spot.city}, {spot.state}, {spot.country}</div>
        <div className="spotDetailsImagesDiv">
            <div className="spotDetailsPreviewDiv"><img className="spotDetailsPreviewImg" alt='preview' src={spot.previewUrl}></img></div>
            <div className="spotDetailsImagesDiv">
                {otherImages && otherImages.length && otherImages.map(si => (
                    <img key={si.id} className="spotDetailsSmallImg" alt='' src={si.url}></img>))}
                {}
            </div>
        </div>
        <section className="spotDetailsSection">
            <div className="spotDetailsHostInfoDiv">
            <h2>{`Hosted by ${owner?.firstName} ${owner?.lastName}`}</h2>
            <p>Wonderful description of unbelievably glowing qualities of our beneficent host</p>
            </div>
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
