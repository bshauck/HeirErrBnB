import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";


import { thunkREADSpot } from "../../store/spots";
import StarRating from "../StarRating";
import {getFullImages} from "../../utils/imageUrl"



function SpotDetails() {
    const spot = useSelector(state => state.spots?.singleSpot);
    console.log("🚀 ~ file: index.js:12 ~ SpotDetails ~ spot:", spot)
    const dispatch = useDispatch();
    const { id } = useParams();
    console.log("🚀 ~ file: index.js:15 ~ SpotDetails ~ id:", id)

    if (!spot || !Object.keys(spot).length || Number(spot.id) !== Number(id)) {
        dispatch(thunkREADSpot(id))
            .then((obj) =>  console.log("🚀 ~ file: index.js:9 ~ SpotDetails ~ obj:", obj))
            .catch(async (res) => {
                const data = await res?.json();
                if (data && data.errors) {
                    // throw new Error(data.errors)
                    return null;
                }
            });
        return null;
    }

    let fills = getFullImages();
    console.log("🚀 ~ file: index.js:32 ~ SpotDetails ~ fills:", fills)
    let previewImage = spot?.SpotImages.find(i => i.preview === true);
    if (!previewImage) {
        previewImage = fills.find(e => e.preview === true)
        fills = fills.filter(e => e?.preview !== true);
    }
    let otherImages = spot?.SpotImages.filter(i => i.preview !== true);
    while (otherImages.length < 4) otherImages.push(fills.pop());
    const owner = spot?.Owner;
    console.log("🚀 ~ file: index.js:31 ~ SpotDetails ~ spot:", spot)
    console.log("🚀 ~ file: index.js:37 ~ SpotDetails ~ otherImages:", otherImages)


    return (
        <div className="spotDetailsDiv">
            <h1>{spot.name}</h1>
            <div className="spotDetailsLocationDiv">{spot.city}, {spot.state}, {spot.country}</div>
            <div className="spotDetailsImagesDiv">
                <div className="spotDetailsPreviewDiv"><img alt='preview' src={previewImage.url}></img></div>
                <div className="spotDetailsImagesDiv">
                    {otherImages && otherImages.length && otherImages.map(i => (
                        <img key={i.id} alt='' src={i.url}></img>
                    ))
                    }
                </div>
            </div>
            <section>
                <h2>{`Hosted by ${owner.firstName} ${owner.lastName}`}</h2>
                <p>Wonderful description of unbelievably glowing qualities of our beneficent host</p>
                <div className="spotDetailsCalloutDiv">
                    <div className="spotDetailsPriceDiv">{`$ ${spot.price} night`}</div>
                    <StarRating avgRating={spot.avgRating} numReviews={spot.numReviews} />
                </div>
            </section>

        </div>
        )
    };

export default SpotDetails ;
