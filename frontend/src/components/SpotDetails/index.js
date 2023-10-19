// frontend/src/components/SpotDetails/index.js
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { thunkReadSpot } from "../../store/spots";
import StarRating from "../StarRating";
import SpotDetailReviewArea from "../SpotDetailReviewArea";

function SpotDetails() {
    const { id } = useParams();
    const [ref] = useState({current:{}});
    const spot = useSelector(state => state.spots.id[id])
    const imageIds = useSelector(state => state.spots.id[id]?.images)
    const dispatch = useDispatch();
    const spotImages = useSelector(state => state.spotImages.id);
    let otherImages = []
    // const [rerender, setRerender] = useState({})
    const placeholderSrc = "https://placehold.co/200?text=Photo+needed&font=montserrat"


  if (!imageIds) {
      if (!ref.current[id]) {
          ref.current[id] = true;
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

  return (
    <div className="spotDetailsDiv">
        <h1 className="spotDetailsHeading">{spot.name}</h1>
        <div className="spotDetailsLocationDiv">{spot.city}, {spot.state}, {spot.country}</div>
        <div className="spotDetailsImagesDiv">
            <div className="spotDetailsPreviewDiv"><img className="spotDetailsPreviewImg" alt='preview' src={spot.previewUrl}></img></div>
            <div className="spotDetailsSmallImagesDiv">
                {otherImages && otherImages.length && otherImages.map(si => (
                    <img key={si.id} className="spotDetailsSmallImg" alt='' src={si.url}></img>))}
                {}
            </div>
        </div>
        <section className="spotDetailsSection">
            <div className="spotDetailsHostInfoDiv">
            <h2>{`Hosted by ${owner?.firstName} ${owner?.lastName}`}</h2>
            <p className="hostP" >Oh, no; I just COULDN"T talk about myself. Here's a review from one of my many dear guests! "The moment I crossed the threshold of their enchanting abode, a symphony of warmth and welcome orchestrated by the extraordinary host enveloped me, making each corner gleam with the essence of unparalleled hospitality and kindness.

            Wonderful description of the unbelievably glowing qualities of our beneficent host.

"Navigating through rooms, each space seemed to echo the meticulous attention and thoughtful precision with which our gracious host had prepared for my visit, every detail, from the scents wafting through the air to the softness of the linens, woven with the fabric of genuine care.

Wonderful description of the unbelievably glowing qualities of our beneficent host.

"In their presence, an opulent garden of conversations blossomed, where each word they uttered seemed to flow like honey, rich with the nectar of interest and engagement, illuminating the atmosphere with the luminescence of connection and understanding.

Wonderful description of the unbelievably glowing qualities of our beneficent host.

"The culinary symphony they conducted in their kitchen was nothing short of magical; every dish a masterpiece that danced on the palate with the elegance of exquisite flavors, each meal a celebration of their immense talent and generosity.

Wonderful description of the unbelievably glowing qualities of our beneficent host.

"Their impeccable sense of timing, the rhythmic flow with which they managed every aspect of the visit, transformed ordinary moments into timeless memories, each gesture shimmering with the brilliance of their exceptional organizational prowess.

Wonderful description of the unbelievably glowing qualities of our beneficent host.

"The generosity of their spirit manifested in countless delightful surprises, turning every interaction into a treasure trove of shared laughter, thoughtful discussions, and the weaving of beautiful memories that will be cherished in the tapestry of time.

Wonderful description of the unbelievably glowing qualities of our beneficent host.


</p><br></br>
            <p className="hostP" >"As I bade farewell to this magnificent host, a cascade of gratitude flooded my heart, leaving me in awe of the profound and transformative experience they curated with such love, creativity, and mastery, turning their home into a haven of joy, comfort, and unforgettable moments." Wonderful description of the unbelievably glowing qualities of our beneficent host. Wonderful description of the unbelievably glowing qualities of our beneficent host. Wonderful description of the unbelievably glowing qualities of our beneficent host. Wonderful description of the unbelievably glowing qualities of our beneficent host. Wonderful description of the unbelievably glowing qualities of our beneficent host. Wonderful description of the unbelievably glowing qualities of our beneficent host. Wonderful description of the unbelievably glowing qualities of our beneficent host. Wonderful description of the unbelievably glowing qualities of our beneficent host. Wonderful description of the unbelievably glowing qualities of our beneficent host. </p>
            </div>
            <div className="spotDetailsCalloutDiv">
                <div className="spotDetailsPriceNightAndStarsDiv">
                  <div className="spotDetailsPriceAndNightDiv">
                  <span className="spotDetailsPriceSpan">{`$${spot.price}  `} </span><span className="spotDetailsNightSpan" >night</span></div><span className="spotDetailsStarRatingSpan">
                <StarRating className="spotDetailsCalloutRating" avgRating={spot.avgRating} numReviews={spot.numReviews} /></span>
                </div>
                <button className="reserveButton" onClick={handleReserveClick}>Reserve</button>
            </div>
            <div className="spotDetailssHR"></div>
        </section>
        <SpotDetailReviewArea spot={spot} />
    </div>
    )
};

export default SpotDetails ;
