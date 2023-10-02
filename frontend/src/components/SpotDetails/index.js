import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import { thunkREADSpot } from "../../store/spots";
import StarRating from "../StarRating";
import { getFullImages } from "../../utils/imageUrl"
import SpotDetailReviewArea from "../SpotDetailReviewArea";

function SpotDetails() {
    const { id } = useParams();
    const spot = useSelector(state => state.spots.singleSpot)
    const keyedSpot = useSelector(state => state.spots[id])
    const dispatch = useDispatch();

    if (!spot || !Object.keys(spot).length || Number(spot.id) !== Number(id)) {
        if (keyedSpot !== null)
        (async()=>await dispatch(thunkREADSpot(id)))();
        return null;
    }

    let fills = getFullImages();
    let previewImage = spot?.SpotImages?.find(i => i.preview === true);
    previewImage = previewImage?.url;
    if (!previewImage) previewImage = fills[0]
    let otherImages = spot?.SpotImages?.filter(i => i.preview !== true);
    otherImages = otherImages?.map(e => e?.url)
    if (!otherImages) otherImages = [];
    while (otherImages.length < 4) otherImages.push(fills.pop());
    const owner = spot?.Owner;
    function handleReserveClick(){
        alert("Feature Coming Soon...")
    }
    if (!spot) return null;

    return (
        <div className="spotDetailsDiv">
            <h1>{spot.name}</h1>
            <div className="spotDetailsLocationDiv">{spot.city}, {spot.state}, {spot.country}</div>
            <div className="spotDetailsImagesDiv">
                <div className="spotDetailsPreviewDiv"><img alt='preview' src={previewImage}></img></div>
                <div className="spotDetailsImagesDiv">
                    {otherImages && otherImages.length && otherImages.map((url,i) => (
                        <img key={i} alt='' src={url}></img>
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
            <SpotDetailReviewArea detailedSpot={spot} />
        </div>
        )
    };

export default SpotDetails ;
