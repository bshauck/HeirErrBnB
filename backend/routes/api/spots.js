const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Booking, Review, Spot } = require('../../db/models');
const router = require('express').Router();


router.route('/:spotId(\\d+)/bookings')
    .get(requireAuth, async (req, res) => {
})
    .post(requireAuth, async (req, res) => {
});


router.get('/:spotId(\\d+)/reviews')
    .get(async (req, res) => {
})
    .post(requireAuth, async (req, res) => {
});


router.post('/:spotId(\\d+)/images', requireAuth, async (req, res) => {
});


router.get('/current', requireAuth, async (req, res) => {
});


router.route('/:spotId(\\d+)')
    .delete(requireAuth, async (req, res) => {
})
    .get(async (req, res) => {
})
    .put(requireAuth, async (req, res) => {
});


router.route('')
    .get(async (req, res) => {
})
    .put(requireAuth, async (req, res) => {
});

module.exports = router;
