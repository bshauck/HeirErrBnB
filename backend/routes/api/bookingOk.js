const { unauthor } = require('../../utils/auth');
const { Booking } = require('../../db/models');
const { Op } = require('sequelize');
const {dayDate, ymd } = require('../../utils/normalizeDate');


// Used in spot.js and bookings
async function bookingOk(startDate, endDate, next, spotId, id) {
    const specificErrText = "Sorry, this spot is already booked for the specified dates";
    const err = Error("Part of date range is already booked");
    startDate = dayDate(startDate);
    endDate = dayDate(endDate);
    const idClause = id === undefined
        ? {} : {id: {[Op.ne]: id}};
    const errors = {};
    const conflict = await Booking.findOne({
    where: {startDate: {[Op.lt]: ymd(endDate)},
            endDate: {[Op.gt]: ymd(startDate)},
                spotId: {[Op.eq]: spotId},
                ...idClause}
    });
    if (conflict) {
        const conflict2 = await Booking.findOne({
            where: {startDate: {[Op.lte]: ymd(startDate)},
                    endDate: {[Op.gt]: ymd(startDate)},
                        spotId: {[Op.eq]: spotId},
                        ...idClause}
        });
        if (conflict2) {errors.startDate = "Start date conflicts with an existing booking"; err.message = specificErrText;}
        const conflict3 = await Booking.findOne({
            where: {startDate: {[Op.lt]: ymd(endDate)},
                    endDate: {[Op.gte]: ymd(endDate)},
                    spotId: {[Op.eq]: spotId},
                    ...idClause}
        });
        if (conflict3) {errors.endDate = "End date conflicts with an existing booking"; err.message = specificErrText;}
    }
    if (conflict) {
        err.title = "Bad Request";
        err.errors = errors;
        return unauthor(next, err);
    }
    else return true;
};

module.exports = { bookingOk }
