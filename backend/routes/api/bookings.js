const { validateEditBooking } = require('../../utils/validation');
const { fitsAuthor, requireAuth, unauthor } = require('../../utils/auth');
const { dayDate, ymd, ymdt } = require('../../utils/normalizeDate')
const { Booking, Spot, SpotImage } = require('../../db/models');
const { Op } = require('sequelize');
const { adjustPojo } = require('../../utils/pojo')
const router = require('express').Router();



// DUPLICATED: refactor
async function bookingOk(startDate, endDate, next, id) {
    const specificErrText = "Sorry, this spot is already booked for the specified dates";
    const err = Error("Part of date range is already booked");
    startDate = dayDate(startDate);
    endDate = dayDate(endDate);
    const idClause = id === undefined
        ? {} : {id: {[Op.ne]: id}};
    const errors = {};
    const conflict = await Booking.findOne({
    where: {startDate: {[Op.lt]: ymd(endDate)},
            endDate: {[Op.gt]: ymd(startDate),
            ...idClause}
    }});
    if (conflict) {
        const conflict2 = await Booking.findOne({
            where: {startDate: {[Op.lte]: ymd(startDate)},
                    endDate: {[Op.gt]: ymd(startDate),
                    ...idClause}
        }});
        if (conflict2) {errors.startDate = "Start date conflicts with an existing booking"; err.message = specificErrText;}
        const conflict3 = await Booking.findOne({
            where: {startDate: {[Op.lt]: ymd(endDate)},
                    endDate: {[Op.gte]: ymd(endDate),
                    ...idClause}
        }});
        if (conflict3) {errors.endDate = "End date conflicts with an existing booking"; err.message = specificErrText;}
    }
    if (conflict) {
        err.title = "Bad Request";
        err.errors = errors;
        return unauthor(next, err);
    }
    else return true;
};


// Return all of current user's bookings.
router.get('/current', requireAuth, async (req, res) => {
    let Bookings = await Booking.findAll({
        include: {model: Spot, attributes: {exclude: ['description', 'createdAt', 'updatedAt']},
         },
        where: {userId: {[Op.eq]: req.user.id},
                endDate: {[Op.gt]: ymd(Date.now())}},
        order: [['endDate','ASC']]
    });
    Bookings = Bookings.map(e=>adjustPojo(e.toJSON(),['id', 'spotId', 'Spot','userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']));
    Bookings.forEach(b => {b.startDate = ymdt (b.startDate); b.endDate = ymdt(b.endDate)})
    return res.json({Bookings});
});

router.route('/:bookingId(\\d+)')
    // Update and return current user's existing booking.
    .put(requireAuth, validateEditBooking, async (req, res, next) => {
        const booking = await Booking.findByPk(req.params.bookingId);
        if (booking) {
            if (fitsAuthor(req, next, booking.userId)) {
                const {startDate, endDate} = req.body;
                if (startDate) booking.startDate = ymdt(startDate);
                if (endDate) booking.endDate = ymdt(endDate);
                if (booking.endDate.getTime() <= dayDate(new Date()).getTime()) {
                    return unauthor(next, Error("Past bookings can't be modified"));
                }
                if (await bookingOk(booking.startDate, booking.endDate, next, booking.id)) {
                    // booking.startDate = ymdt(booking.startDate)
                    // booking.endDate = ymdt(booking.endDate)
                    await booking.save();
                    return res.json(booking);
                } else return;
            }
        } else return res.status(404).json({message: "Booking couldn't be found"})
        return next(new Error('PUT /bookings/:id error'))
    })
    // Delete an existing booking (current user's, or Spot's if owner's)
    .delete(requireAuth, async (req, res, next) => {
        let booking = await Booking.findByPk(req.params.bookingId);
        if (!booking) return res.status(404).json({message: "Booking couldn't be found"});

        if (dayDate(new Date()) > booking.startDate) return unauthor(next, Error("Bookings that have been started can't be deleted"));

        if (booking.userId == req.user.id ||
            (await Spot.findByPk(booking.spotId).ownerId == req.user.id)) {
                await booking.destroy();
                return res.json({message: "Successfully deleted"});
        }
        else return fitsAuthor(req, next, -1);
    });


module.exports = router;
