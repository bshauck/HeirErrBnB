import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Calendar } from 'react-calendar';

import OpenModalButton from '../OpenModalButton';

import { addDays, dateEQ, dayDate, ymd} from '../../utils/normalizeDate';

import "./try.css"

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

function BookingCalendar({ onClick, tuples }) {
    const today = new Date()
    const todayStr = ymd(today)
    const tomorrow = addDays(today, 1)
    const weekOut = addDays(tomorrow, 7)
    const yearOut = addDays(today, 365)
    const userId = useSelector(state => state.session.user.id)

    const editDates = useSelector(state => state.bookings.edit[userId])

    const [dates, setDates] = useState(editDates ? editDates.slice() : [tomorrow, weekOut])
    const [curDates, setCurDates] = useState(dates ? dates.slice() : [null, null]);
    const [activeStartDate, setActiveStartDate] = useState(editDates ? firstDateOfMonth(editDates[0]) : null); // work around bug, can use this to page

    useEffect(()=>{

    }, [curDates, dates])

    console.log("editDates in modal: ", editDates)
    console.log("dates in modal: ", dates)
    console.log("curDates in modal: ", curDates)
    console.log("activeStartDate in modal: ", activeStartDate)

    let value = editDates?.slice();
    // if (dates) setValue(dates.slice());

   function firstDateOfMonth(startDate) {
    const dateStr = ymd(startDate)
    return dayDate(dateStr.slice(0,8)+"01")
 }

    function dateOrNullEQ(v1, v2) {
      return ((v1 === null && v2 === null) ||
        (v1 instanceof Date && v2 instanceof Date && dateEQ(v1, v2)))
    }
    /* gives [startDate, endDate|null], event */

    function handleActiveDateChange(val, _event) {
      console.log("activedatechange: val", val)
    }
    function handleChange(nextValue, _event) {
      const [start, end] = nextValue;
      setDates(nextValue)
      const [curStart, curEnd] = curDates;
      console.log("setting start and end to ", start, end)
      /* if new start, reset disabled */
      if (dateOrNullEQ(start, curStart) && dateOrNullEQ(end, curEnd))
        return;
      setCurDates([start, end])
      console.log("curDate ", curDates)
    }

    function isTileDisabled({ date }) {
      const onlyStartSelected = value[0] !== null && value[1] === null;
      const dateStr = ymd(date)
      /* have to book after today */
      if (dateStr <= todayStr) return true;
      /* first click is start, so 2nd click must be greater */
      if (onlyStartSelected) {
        if (dateStr < ymd(value[0])) return true;
        /* can book ends on existing starts */
//        return !tuples.every(([startStr, endStr]) => (dateStr <= startStr ||  dateStr > endStr))
return false;
      } else /* whether 0/2 selected, the next click is a start */
        /* if we have a minimum stay, we'd adjust the following
         * to ensure that the click was on a day that was at least
         * that minimum away from an existing start
         */
 //       return !tuples.every(([startStr, endStr]) => (dateStr < startStr || dateStr >= endStr))
 return false
    }


    /*
     * activeStartDate the day to begin showing calendar
     * allowPartialRange whether a range can only be partly filled in on return
     *   true so you can disable all dates to earlier than first click
     * calendarType sets start day-of-week and what is considered weekend
     *   need 'gregory' for starting Sunday
     * className additional class names (String "class1 class2")
     * defaultValue use array of 2 dates; do NOT use value
     * defaultView see view
     * formatDay (if needed to override default formatting)
     * formatMonth (if needed to override default formatting)
     * formatMonthYear (if needed to override default formatting)
     * goToRangeStartOnSelect=false (needed for bug control)
     * inputRef
     * locale
     * maxDate set for a year out; evetually Host sets per location
     * maxDetail most detailed view user may see; is selection level
     * minDate set for tomorrow; no same-day booking
     * minDetail least detailed view user may see
     * onChange function called when user clicks a date
     * returnValue either start/end/range
     * selectRange want a start / end for a booking
     * showDouble={true} Show two months at a time
     * tileClassName given to detailed item (day on month view)
     * tileContent custom content to display on tile
     * tileDisabled function to determine if date should be disabled
     *   obviously all booked dates in tuples, but also all dates
     *   earlier than start when only start selected
     * value value to show on calendar; use defaultValue to dynamically change
     *   i.e., don't use this, use defaultValue
     * view how much is shown (use defaultView if need to change dynamically)
     *   I.e., use view, do NOT use defaultView to keep on "month"
    */
   /*
   unfortuantely, show double view forces ignoring show neighboring month

   defaultValue={value}
   showDoubleView={true}
   tileDisabled={isTileDisabled}
   value={value}
   */

  return (
    <>
    <OpenModalButton
        buttonText="Open Calendar"
        onButtonClick={onClick}
        modalComponent={
          <Calendar
          activeStartDate={activeStartDate}
          allowPartialRange={true}
          calendarType="gregory"
          goToRangeStartOnSelect={false}
          maxDate={yearOut}
          maxDetail="month"
          minDate={today}
          minDetail="month"
          onActiveDateChange={handleActiveDateChange}
          onChange={handleChange}
          returnValue="range"
          selectRange={true}
          showOtherMonthDays={false}
          showNeighboringMonth={false}
          showYearArrows={false}
          tileClassName="date"
          value={dates}
          view="month"
          />
        }
      />
      </>
    )
}

export default BookingCalendar;
