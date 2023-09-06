const { fitsAuthor, requireAuth } = require('../../utils/auth');
const { validateReview, validateSpot } = require('../../utils/validation');
const { sequelize, Op, Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const router = require('express').Router();

router.route('/:spotId(\\d+)/bookings')
    .get(requireAuth, async (req, res) => {
        const bookings = await Booking.findAll({
            attributes: ['spotId', 'startDate', 'endDate'],
            where: {spotId: req.params.spotId},
        });
        return res.json({Bookings: bookings});
    })
    .post(requireAuth, async (req, res, next) => {
        const spot = await Spot.findByPk(req.params.spotId);
        if (spot) {
            if (fitsAuthor(req, next, spot.id, false)){
                const {startDate, endDate} = req.body;
                const booking = await Booking.create({
                    spotId: spot.id,
                    userId: req.user.id,
                    startDate,
                    endDate
                });
                if (booking) return res.json(booking);
                else console.log('no booking in post bookings')
            } else console.log('no fits: ', `${req.user.id} != ${spot.id}`)
        } else console.log('no spot in post bookings')
        return next(new Error('POST /spots/:id/bookinngs error'))
    });


router.post('/:spotId(\\d+)/images', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) /* error*/ 1+1;
    if (fitsAuthor(req, next, spot.ownerId)) {
        const {url, preview} = req.body;
        let image = await SpotImage.create({spotId: spot.id, url, preview});
        if (image) {
            image = image.toJSON();
            delete image.spotId;
            delete image.createdAt;
            delete image.updatedAt;
            return res.json(image);
        }
    }
    return next(new Error('POST /spot/:id/images error'))
    });


router.route('/:spotId(\\d+)/reviews')
    .get(async (req, res) => {
        const reviews = await Review.findAll({
            include: [
                {model: User, attributes: ['id', 'firstName', 'lastName']},
                {model: ReviewImage , attributes: ['id','url']  },
            ],
            where: {spotId: req.params.spotId},
        });
        return res.json(reviews);
    })
    .post(requireAuth, validateReview, async (req, res) => {
        const spot = await Spot.findByPk(req.params.spotId);
        if (!spot) return res.status(404).json({message: `Spot couldn't be found`});
        const old = await Review.findOne({
            where: {userId: req.user.id,
                    spotId: spot.id}
        });
        if (old) return res.status(500).json({message: "User already has a review for this spot"});
        const {review, stars} = req.body;
        const newReview = await Review.create({
            userId: req.user.id,
            spotId: spot.id,
            review,
            stars
        });
        return res.json(newReview);
    });


router.get('/current', requireAuth, async (req, res) =>
    spotsWhere(req, res, {ownerId: req.user.id}))


router.route('/:spotId(\\d+)')
    .delete(requireAuth, async (req, res, next) => {
        let spot = await Spot.findByPk(req.params.spotId);
        if (!spot) return res.status(404).json({message: "Spot couldn't be found"});
        if (fitsAuthor(req, next, spot.ownerId)) {
            await spot.destroy();
            return res.json({message: "Successfully deleted"});
        }
        else return next(new Error('DELETE /spots/:id error'));
    })
    .get(async (req, res) => {
        // let spot = await Spot.findByPk(req.params.spotId);
        let spot = await Spot.findByPk(req.params.spotId, {
            attributes: { include: [
                // [sequelize.fn('COUNT', sequelize.col('Reviews.stars')) , 'numReviews'],
                // [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
            ]  }  ,
            include: [
                // { model: Review, attributes: []},
                // { model: SpotImage, attributes: []},
                // { model: User, attributes: []},
                // { model: Review, attributes: [
                // [sequelize.fn('COUNT', sequelize.col('stars')), 'starCount'],
                // [sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating'],
                // ] },
                { model: SpotImage,
                    attributes: {exclude: ['spotId', 'createdAt', 'updatedAt']}},
                    { model: User,
                        as: 'Owner',
                        attributes: {exclude: ['username', 'hashedPassword', 'email', 'updatedAt', 'createdAt']}}
                    ],
                    // where: {id: {[Op.not]: null}}
                    // group: ['Reviews.spotId']
                });
                let reviewInfo = await Review.findAll({
                    attributes: [
                        [sequelize.fn('COUNT', sequelize.col('stars')), 'starCount'],
                        [sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating']
                    ],
                    where: {spotId: spot.id}
        });
        spot = spot.toJSON(); reviewInfo = reviewInfo[0].toJSON();
        return res.json({...spot, ...reviewInfo});
    })
    .put(requireAuth, validateSpot, async (req, res, next) => {
        let spot = await Spot.findByPk(req.params.spotId);
        if (spot) {
            if (fitsAuthor(req, next, spot.ownerId)) {
            const {address, city, state, country, lat, lng, name, description, price} = req.body;
            if (address) spot.address = address;
            if (city) spot.city = city;
            if (state) spot.state = state;
            if (country) spot.country = country;
            if (lat) spot.lat = lat;
            if (lng) spot.lng = lng;
            if (name) spot.name = name;
            if (description) spot.description = description;
            if (price) spot.price = price;
            await spot.save();
            spot = spot.toJSON();
            delete spot.id;
            delete spot.ownerId;
            delete spot.createdAt;
            delete spot.updatedAt;
            return res.json(spot)
            }
        }
        return next(new Error('PUT /spots/:id error'))
  });


router.route('')
    .get(async (req, res) => {
    const {page,size,minLat,maxLat,minLng,maxLng,minPrice,maxPrice} = req.query;
    let spots = await Spot.findAll({
        include: [
            {   model: Review,
                required: false,
                attributes: ['stars']},
            { model: SpotImage,
                required: false,
                attributes: ['url'],
                where: {preview: true}},
        ],
        // where: {...where},
    });
    /* any better approach than this fix up after? */
    spots = spots.map(e=>e.toJSON());
    spots.forEach(s=>{s.avgRating =
        s.Reviews && s.Reviews.length && (s.Reviews.reduce((acc, next)=> acc + next.stars, 0) / s.Reviews.length);
        if (!s.avgRating) s.avgRating = null;
        delete s.Reviews;
        s.previewImage =
        s.SpotImages && s.SpotImages.length && s.SpotImages[0] && s.SpotImages[0].url
            ? s.SpotImages[0].url : null;
        delete s.SpotImages
    });
    return res.json({Spots: spots});
    })
    .post(requireAuth, validateSpot, async (req, res) => {
        const {address, city, state, country, lat, lng, name, description, price} = req.body;
        let spot = await Spot.create({
            ownerId: req.user.id,
            address, city, state, country, lat, lng,
            name, description, price});
        if (spot) {
            spot = spot.toJSON();
            delete spot.updatedAt;
            delete spot.createdAt;
            return res.status(201).json(spot);
        }
        return next(new Error('POST /spots error'))
        });


async function spotsWhere(req, res, where={}) {
    let spots = await Spot.findAll({
        include: [
            { model: SpotImage,
                required: false,
                attributes: ['url'],
                where: {preview: true}},
            // {   model: Review,
            //     required: false,
                // attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']]
            // }
        ],
        where: {...where},
        // group: ['Reviews.spotId']
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
};

module.exports = router;
