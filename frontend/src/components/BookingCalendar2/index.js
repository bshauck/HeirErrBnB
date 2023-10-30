import { useState } from 'react';
import { Calendar } from 'primereact/calendar';

import OpenModalButton from '../OpenModalButton';

import { addDays /* , findAvailableRange, ymd */ } from '../../utils/normalizeDate';

/* Date utilities
 *
 * addDays(date, addend) takes a Date or string or number of milliseconds and
 * turns it into a Date with no time, and returns a Date that is addend days
 * away from it (negative for past).
 *
 * ymd(date) takes the same input(s) and returns a string in the format
 * 'YYYY-MM-DD' for that date.
 *
 * findAvailableRange(dateTuples, stayLength, searchDelay, lastDate)
 *    returns date range [start, end] or null if unable to find
 * dateTuples is a sorted ascending set of blocked-out start/end dates
 * stayLength is how long of a range to find
 * searchDelay is how far out from today to start the search
 * lastDate is the final date available to book
 * we assume dateTuples last endDate is <= lastDate
 * repeat search with smaller stayLength until down to 1, then tell user
 * no open dates available.
 *
 * Eventually some of these criteria will be set by host per location.
 *
 * For now, we default to starting search a week out from today, and
 * looking for a 5-day stay, and going down to 2 days as a minimum,
 * and not allowing booking dates more than 1 year out.
 */


    /*
     * CALENDAR2 (Prime)
     *
     * dateFormat controls how dates are returned
     * dateTemplate
     * disabledDates array of dates which are disabled
     * footerTemplate
     * headerTemplate
     * inline vs popup (default)
     * numberOfMonths number to show if more than 1
     * onViewDateChange (if in controlled mode)
     * selectionMode "single" "multiple" "range" will use "range"
     * showButtonBar
     * tooltip
     * tooltipOptions
     * viewDate used for initial viewing at start
     */

function BookingCalendar2({ dates, tuples }) {
    /* dates needs to be an array of size 2, startDate, endDate */
    /* tuples is an array of arrays of the above, in ascending order */
    const today = new Date()
    // const tomorrow = addDays(today, 1)
    // const days3Out = addDays(today, 3)
    const weekOut = addDays(today, 7)
    // const weeksOut = addDays(today, 14)
    const yearOut = addDays(today, 365)

    const [value, setValue] = useState(dates);

    let disabledDates = [] // filled based on tuples; AND start clicks


    return (
        <>
        <OpenModalButton
            buttonText="Open Calendar"
            modalComponent={
<Calendar
    dateFormat="yy-mm-dd"
    disabledDates={disabledDates}

    inline

    maxDate={yearOut}
    minDate={weekOut}
    numberOfMonths={2}
    onChange={e => setValue(e.value)}
    readOnlyInput
    selectionMode="range"
    selectOtherMonths={true}
    showButtonBar={false}
    showMinMaxRange={false}
    showOtherMonths={false}
    value={value}
    viewDate={weekOut}
/>
}
          />
         </>
    );
}

export default BookingCalendar2;
