// A "dayDate" is a Date whose time value is
// exactly midnight. This lets you compare dates
// more easily with getTime() / valueOf()

// Note: all JS dates are numbers: milliseconds
// since UNIX epoch Jan 1, 1970 UTC. The various
// string representations are just what Date.parse()
// can turn into such a millisecond value. That
// function will return NaN if unable to parse argument.

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

function addDays(dDate, numDays) { // mutates receiver
    dDate.setDate(dDate.getDate() + numDays)
}

/* the following functions all assume d1 and d2
   are already in day Date format
*/
function dayGT(d1, d2) {
    return d1.getTime() > d2.getTime()
}
function dayLT(d1, d2) {
    return d1.getTime() < d2.getTime()
}
function dayGTE(d1, d2) {
    return dayGT(d1, d2) || dayEQ(d1, d2)
}
function dayLTE(d1, d2) {
    return dayLT(d1, d2) || dayEQ(d1, d2)
}

function dayEQ(d1, d2) {
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

module.exports = { addDays, dayDate, dayGTE, dayLTE, ymd, ymdt }
