function StarRating({avgRating, numReviews}) {

    /* Return star icon followed by the average
     * rating printed to 2 decimal places rounded,
     * but if the 2nd decimal digit is 0, omit it;
     * and then a centered dot and then the number
     * of reviews. If the number of reviews is
     * zero, instead just return the icon followed
     * by "New". If the count is undefined, then
     * only have the icon and average.
     */
    function starString (avg, num) { // if bad or no data, return New
        if (num === 0 || num === null || !avg) return "New";
        const reviewString = (num === undefined) // no num? -- short form
            ? "" : ` · ${num} review${num === 1 ? "" : "s"}`

        const parsedValue2 = (parseFloat(avg).toFixed(2));
        const parsedValue1 = (parseFloat(avg).toFixed(1));
        avg = (parseFloat(parsedValue1) === parseFloat(parsedValue2))
            ? parsedValue1 : parsedValue2;
        return `${avg}${reviewString}`
    }
/* <i class="fa-regular fa-star"></i>
<i className="fa-solid fa-star"></i> */

    return  (
        <span className="starRatingSpan">
            <i className="fa-solid fa-star"></i>
            {starString(avgRating, numReviews)}
        </span>
    )
}

export default StarRating ;
