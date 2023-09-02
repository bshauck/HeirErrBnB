const { requireAuth } = require('../../utils/auth');
const { Booking, Review, Spot } = require('../../db/models');
const router = require('express').Router();


router.route('/:spotId(\\d+)/bookings')
    .get(requireAuth, async (req, res) => {
        return res.status(500).json("Implementation TBD")
    })
    .post(requireAuth, async (req, res) => {
        return res.status(500).json("Implementation TBD")
    });


router.route('/:spotId(\\d+)/reviews')
    .get(async (req, res) => {
        return res.status(500).json("Implementation TBD")
    })
    .post(requireAuth, async (req, res) => {
        return res.status(500).json("Implementation TBD")
    });


router.post('/:spotId(\\d+)/images', requireAuth, async (req, res) => {
    return res.status(500).json("Implementation TBD")
});


router.get('/current', requireAuth, async (req, res) => {
    return res.status(500).json("Implementation TBD")
});


router.route('/:spotId(\\d+)')
    .delete(requireAuth, async (req, res) => {
        return res.status(500).json("Implementation TBD")
    })
    .get(async (req, res) => {
        return res.status(500).json("Implementation TBD")
    })
    .put(requireAuth, async (req, res) => {
        return res.status(500).json("Implementation TBD")
    });


router.route('')
    .get(async (req, res) => {
        return res.status(500).json("Implementation TBD")
    })
    .post(requireAuth, async (req, res) => {
        return res.status(500).json("Implementation TBD")
    });

module.exports = router;
