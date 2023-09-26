import { FontAwesomeIcon } from 'react-fontawesome';


function StarRating({avgRating, numReviews}) {

    function starString (avg, num) {
        console.log("🚀 ~ file: index.js:7 ~ starString ~ avg, num:", avg, num)
        // if (!num) return (<span className="starStringNewSpan">New</span>);
        if (!num) return null;
        const parsedValue2 = (parseFloat(avg).toFixed(2));
        const parsedValue1 = (parseFloat(avg).toFixed(1));
        avg = (parseFloat(parsedValue1) === parseFloat(parsedValue2))
            ? parsedValue1 : parsedValue2;

            return null;

        // return (
        // <span className="starStringSpan">{`${avg} · ${num} Review${num === 1 ? "" : "s"}`}</span>
        //     )
        }

    return null &&
        <div className="starRatingDiv"><FontAwesomeIcon icon="fa-solid fa-star" />
            {starString(avgRating, numReviews)}
        </div>
    // );
}

export default StarRating ;
