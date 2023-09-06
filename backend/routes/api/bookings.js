const { validateBooking } = require('../../utils/validation');
const { requireAuth, fitsAuthor } = require('../../utils/auth');
const { Booking, Spot } = require('../../db/models');
const router = require('express').Router();

function adjustPojo(pojo, array) {
    // Take existing attributes one at a time from array, and
    // grab the value, delete the key, and reinsert it at end
    // with original value.
    array.forEach(k=>{
        let tmp = pojo[k];
        delete pojo[k];
        pojo[k] = tmp;
    });
}
// Return all of current user's bookings.
router.get('/current', requireAuth, async (req, res) => {
    let bookings = await Booking.findAll({
        include: {model: Spot, attributes: {exclude: ['description', 'createdAt', 'updatedAt']}},
        where: {userId: req.user.id}
    });
    bookings = bookings.map(e=>e.toJSON());
    bookings.forEach(b=>adjustPojo(b,['userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']));
    return res.json(bookings);
});

router.route('/:bookingId(\\d+)')
    // Update and return current user's existing booking.
    .put(requireAuth, validateBooking, async (req, res, next) => {
        const booking = await Booking.findByPk(req.params.bookingId);
        if (booking) {
            if (fitsAuthor(req, next, booking.userId)) {
                const {startDate, endDate} = req.body;
                if (startDate) booking.startDate = startDate;
                if (endDate) booking.endDate = endDate;
                await booking.save();
                return res.json(booking);
            } else console.log('fitsAuthor', req.user.id, booking.userId, booking)
        } else console.log('no booking in PUT /bookings/:id')
        return next(new Error('PUT /bookings/:id error'))
    })
    // Delete an existing booking (current user's, or Spot's if owner's)
    .delete(requireAuth, async (req, res, next) => {
        let booking = await Booking.findByPk(req.params.bookingId);
        if (!booking) return res.status(404).json({message: "Booking couldn't be found"});

        if (Date.now() > booking.startDate) return res.status(403).json({message: "Bookings that have been started can't be deleted"});

        if (booking.userId == req.user.id ||
            (await Spot.findByPk(booking.spotId).ownerId == req.user.id)) {
                await booking.destroy();
                return res.json({message: "Successfully deleted"});
        }
        else return fitsAuthor(req, next, -1);
    });


module.exports = router;
