const { requireAuth } = require('../../utils/auth');
const { sequelize, Op, Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const router = require('express').Router();


router.route('/:spotId(\\d+)/bookings')
    .get(requireAuth, async (req, res) => {
        const reviews = await Booking.findAll({
            where: {spotId: req.params.spotId},
        });
        return res.json(reviews);
    })
    .post(requireAuth, async (req, res) => {
        return res.status(500).json("Implementation TBD")
    });


router.route('/:spotId(\\d+)/reviews')
    .get(async (req, res) => {
        const reviews = await Review.findAll({
            // include: {model: User, attributes: ['id', 'firstName', 'lastName']},
            include: {model: ReviewImage /*, attributes: ['id','url'] */ },
            where: {spotId: req.params.spotId},
        });
        return res.json(reviews);
    })
    .post(requireAuth, async (req, res) => {
        return res.status(500).json("Implementation TBD")
    });


router.post('/:spotId(\\d+)/images', requireAuth, async (req, res) => {
    return res.status(500).json("Implementation TBD")
});


router.get('/current', requireAuth, async (req, res) => {
    const spots = await Spot.findAll({
        where: {ownerId: req.user.id}
    });
    return res.json(spots);
});


router.route('/:spotId(\\d+)')
    .delete(requireAuth, async (req, res) => {
        return res.status(500).json("Implementation TBD")
    })
    .get(async (req, res) => {
        let spot = await Spot.findByPk(req.params.spotId, {
            attributes: /* { include: */ ['id',
                [sequelize.fn('COUNT', sequelize.col('Reviews.stars')), 'numReviews'],
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
            ] /* } */,
            include: [
                { model: Review, attributes: [[sequelize.fn('COUNT', sequelize.col('stars')), 'starCount']] },
                { model: SpotImage, attributes: []},
                // { model: User, attributes: []},
                // { model: SpotImage,
                //   attributes: {exclude: ['spotId', 'createdAt', 'updatedAt']}},
                // { model: User,
                //   as: 'Owner',
                //   attributes: {exclude: ['username', 'hashedPassword', 'email', 'updatedAt', 'createdAt']}}
            ],
            // where: {id: {[Op.not]: null}}
            // group: ['Reviews.spotId']
        });
        return res.json(spot);
    })
    .put(requireAuth, async (req, res) => {
        return res.status(500).json("Implementation TBD")
    });


router.route('')
    .get(async (req, res) => {
        let spots = await Spot.findAll({
            include: [
                { model: SpotImage,
                    required: false,
                    attributes: ['url'],
                    where: {preview: true}},
                {   model: Review,
                    required: false,
                    attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']]}
            ],
            group: ['Reviews.spotId']
        });
        /* any better approach than this fix up after? */
        spots = spots.map(e=>e.toJSON());
        spots.forEach(s=>{s.avgRating =
            s.Reviews && s.Reviews.length && s.Reviews[0] && s.Reviews[0].avgRating
                ? s.Reviews[0].avgRating : null;
            delete s.Reviews;
            s.previewImage =
            s.SpotImages && s.SpotImages.length && s.SpotImages[0] && s.SpotImages[0].url
                ? s.SpotImages[0].url : null;
            delete s.SpotImages});
        return res.json(spots);
    })
    .post(requireAuth, async (req, res) => {
        return res.status(500).json("Implementation TBD")
    });

module.exports = router;
