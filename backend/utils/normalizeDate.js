// A "dayDate" is a Date whose time value is
// exactly midnight. This lets you compare dates
// more easily with getTime() / valueOf()

// Note: all JS dates are numbers: milliseconds
// since UNIX epoch Jan 1, 1970 UTC. The various
// string representations are just what Date.parse()
// can turn into such a millisecond value. That
// function will return NaN if unable to parse argument.

function findAvailableRange(dateTuples, stayLength, searchDelay, lastDate) {
    /*
     * dateTuples is a sorted array of 2-element subarrays of
     * ascending start/end dates for already booked stays. stayLength
     * is the sought available duration. searchDelay is how many days
     * out from today to start searching. lastDate is the final day
     * available for booking. Ranges may overlap the end/start on
     * the same day.
     *
     * Airbnb starts suggested stays a week out, for a stay of 5 days.
     *
     * The return value is [start, end] of the first available
     * range of stayLength starting at today+searchDelay; or null if
     * no acceptable range is found.
     *
     * We assume the last endDate in dateTuples is no greater than
     * the lastDate.
     */
    let possibleStart = ymd(addDays(new Date(), searchDelay))
    let calculatedEnd = ymd(addDays(possibleStart, stayLength))
    if (!dateTuples.length) return [possibleStart, calculatedEnd]

    let nextRangeStart = ymd(dateTuples[0][0])

    if (calculatedEnd <= nextRangeStart)
        return [possibleStart, calculatedEnd]

    for (let i = 0; i < dateTuples.length - 1; i++) {
        possibleStart = ymdt(dateTuples[i][1])
        nextRangeStart = ymdt(dateTuples[i + 1][0])

        calculatedEnd = addDays(possibleStart, stayLength)

        if (calculatedEnd <= nextRangeStart)
            return [possibleStart, calculatedEnd]
    }

    // Check after the last booked range
    possibleStart = ymd(dateTuples[dateTuples.length - 1][1])
    calculatedEnd = addDays(possibleStart, stayLength)

    return calculatedEnd <= lastDate ? [possibleStart, calculatedEnd] : null
} /* if return null, try again with a smaller proposed stayLength */

// const dateTuples = [
//     ["2023-10-31", "2023-11-02"],
//     ["2023-11-03", "2023-11-05"],
//     ["2023-11-06", "2023-11-10"]
// ];

// const stayLength = 5 // number of overnights
// const searchDelay = 7 // days out from today to start search
// const lastDate = ymd(addDays(new Date(), 365))
// const availableRange = findAvailableRange(dateTuples, stayLength, searchDelay, lastDate)

// console.log("Available Range:", availableRange.map(date => ymd(date)))


function typeCheck(date) {
    return (typeof date === 'string' || typeof date === 'number')
        ? new Date(date) : date
}
function dayDate(date) { // return Date instance with local time 0
    date = typeCheck(date);
    return new Date(date.toDateString())
}

function ymd(date) { // return a string of YYYY-MM-DD of the date
    date = typeCheck(date);
    return date.toISOString().split('T')[0]
}

function ymdt(date) { // return string YYYY-MM-DD 00:00:00 of the date
    // date = typeCheck(date); // not required; within dayDate
    return new Date(ymd(date)).toISOString().replace('T', ' ').split('.')[0]
}

function addDaysInPlace(dDate, numDays) { // mutates argument; returns numeric
    dDate.setDate(dDate.getDate() + numDays)
}

function addDays(date, numDays) { // return a new date numDays in future
    const result = new Date(date);       // past with negative numDays
    addDaysInPlace(result, numDays);
    return result
}

function daysBetweenDatesInclusive(date1, date2) {  
    // Calculate the difference in milliseconds
    const msDifference = Math.abs(secondDate - firstDate);
  
    // Convert milliseconds to days and add 1 to make it inclusive
    const numberOfDays = msDifference / (1000 * 60 * 60 * 24) + 1;
  
    return numberOfDays;
  }

  function daysInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get the first day of the next month
    const firstDateOfNextMonth = new Date(year, month + 1, 1);
    
    // Subtract one day to get the last day of the given month
    const lastDay = new Date(firstDayNextMonth - 1);
    
    return lastDay.getDate();
  }
  

/* the following functions all assume d1 and d2
   are already in dayDate format; dates in ymd
   format can use string comparisons
*/
function dateGT(d1, d2) {
    return d1.getTime() > d2.getTime()
}
function dateLT(d1, d2) {
    return d1.getTime() < d2.getTime()
}
function dateGTE(d1, d2) {
    return dateGT(d1, d2) || dateEQ(d1, d2)
}
function dateLTE(d1, d2) {
    return dateLT(d1, d2) || dateEQ(d1, d2)
}

function dateEQ(d1, d2) {
    return d1.getTime() === d2.getTime()
}


/* Specifically for the Bookings conflict check,
if we could just see if any conflict exists, as
there is a morning leave time and an evening
checking time, so a new start date may be on the
same day as an old end date, and similarly a new
end date may be the same as an old start date;
the query to find conflicts is straight-forward:

SELECT COUNT(*) FROM BOOKINGS
WHERE
    (newStartDate < endDate)
AND
    (newEndDate > startDate);

But since we are supposed to have specific
error messages about start date and end date,
we must do additional queries.

SELECT COUNT(*) FROM BOOKINGS
WHERE
    (newStartDate >= startDate)
AND
    (newStartDate < endDate);

as well as

SELECT COUNT(*) FROM BOOKINGS
WHERE
    (newEndDate <= endDate)
AND
    (newEndDate > startDate);

To get whether there's a specific column
within the conflict range. Unfortunately,
just doing those two queries is not enough
because if a new range entirely OVERLAPS
some existing range, then you need the original
query as well.
*/


module.exports = { addDays, dayDate, dateEQ, dateGT, dateGTE, dateLT, dateLTE, findAvailableRange, ymd, ymdt }

RED HAT presentation on podman vs Docker
red.ht/podman-desktop-slides
github.com/redhat-developer/podman-desktop-demo

Gigi Bekmatova Front End Engineer @ Samsara
Xinyun Shen Software Engineer @ Samsara
Parth Suhane Past: Software Engineer Intern @ Samsara
Bradley Ting Software Engineer @ Samsara
Yangyong Zhang Senior Machine Learning Engineer @ Samsara
Jess Guenette Lead Business Talent Partner @ Samsara

YALE
Annie Z. Full Stack Engineer @ Samsara
Allen Lu Senior Applied Scientist @ Samsara



Jeffrey S. Software Engineer @ Autodesk
Shikha Singh Software Engineer @ Autodesk
Artur Kashperskiy Software Engineer @ Autodesk
Ikshaku Goswami Software Development Engineer 2 @ Autodesk
Reyna Nikolayev Software Development Engineer  @ Autodesk
Tyler SmithSenior Software Engineer @ Autodesk
Nathan Schrader Fullstack Engineer @ Autodesk