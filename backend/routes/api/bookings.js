const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, fitsAuthor } = require('../../utils/auth');
const { Booking } = require('../../db/models');
const spot = require('../../db/models/spot');
const router = require('express').Router();

// Return all of current user's bookings.
router.get('/current', requireAuth, async (req, res) => {
    const bookings = await Booking.findAll({
        where: {userId: req.user.id}
    });
    return res.json(bookings);
});

router.route('/:bookingId(\\d+)')
    // Update and return current user's existing booking.
    .put(requireAuth, async (req, res) => {
        return res.status(500).json("Implementation TBD")
    })
    // Delete an existing booking (current user's, or Spot's if owner's)
    .delete(requireAuth, async (req, res) => {
        let booking = await Booking.findByPk(req.params.bookingId);
        if (!booking) return res.status(404).json({message: "Booking couldn't be found"});

        if (Date.now() > booking.startDate) return res.status(403).json({message: "Bookings that have been started can't be deleted"});

        if (booking.userId == req.user.id ||
            (await Spot.findByPk(booking.spotId).ownerId == req.user.id)) {
                await booking.destroy();
                return res.json({message: "Successfully deleted"});
        }
        else return fitsAuthor(req,next,-1);
    });


module.exports = router;
