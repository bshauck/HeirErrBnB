import { useState } from 'react';
import { Calendar } from 'react-calendar';
import { addDays, findAvailableRange, ymd } from '../../utils/normalizeDate';


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

function BookingCalendar() {
    const today = new Date()
    const tomorrow = addDays(today, 1)
    const yearOut = addDays(today, 365)
    const [value, setValue] = useState([today, tomorrow]);

    function handleChange(nextValue) {
      setValue(nextValue);
    }

    let disabledDates = [] // filled based on Bookings

    function isSameDay(d1, d2) {return false} // TODO

    function isTileDisabled({ date }) {
           return disabledDates.find(dDate => isSameDay(dDate, date));
    }

    /*
     * activeStartDate the day to begin showing calendar
     * allowPartialRange whether a range can only be partly filled in on return
     * calendarType sets start day-of-week and what is considered weekend
     * className additional class names (String "class1 class2")
     * defaultValue value to be shown; use value instead (use array of 2 dates)
     * defaultView see view
     * formatDay (if needed to override default formatting)
     * formatMonth (if needed to override default formatting)
     * formatMonthYear (if needed to override default formatting)
     * goToRangeStartOnSelect
     * inputRef
     * locale
     * maxDate set for a year out; evetually Host sets per location
     * maxDetail most detailed view user may see; is selection level
     * minDate set for tomorrow; no same-day booking
     * minDetail least detailed view user may see
     * onChange function called when user clicks a date
     * returnValue either start/end/range
     * selectRange want a start / end for a booking
     * showDouble="true" Show two months at a time
     * tileClassName given to detailed item (day on month view)
     * tileContent custom content to display on tile
     * tileDisabled function to determine if date should be disabled
     * value value to show on calendar; use defaultValue to dynamically change
     * view how much is shown (use defaultView if need to change dynamically)
     */

   return (
       <div className="bookingCalendarDiv">
    <Calendar
        activeStartDate={today}
        allowPartialRange={true}
        defaultValue={value}
        calendarType="gregory"
        goToRangeStartOnSelect={false}
        maxDate={yearOut}
        maxDetail="month"
        minDate={today}
        minDetail="month"
        onChange={handleChange}
        returnValue="range"
        selectRange={true}
        showDoubleView={true}
        tileClassName="date"
        tileDisabled={isTileDisabled}
        view="month"
        />
    </div>
    )
}

export default BookingCalendar;
