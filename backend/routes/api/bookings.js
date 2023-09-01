const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Booking } = require('../../db/models');
const router = require('express').Router();


// Return all of current user's bookings.
router.get('/current', requireAuth, async (req, res) => {
});

router.route('/:bookingId(\\d+)')
    // Update and return current user's existing booking.
    .put(requireAuth, async (req, res) => {
    })
    // Delete an existing booking (current user's, or Spot's if owner's)
    .delete(requireAuth, async (req, res) => {
});


module.exports = router;
