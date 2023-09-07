const { fitsAuthor, requireAuth, unauthor } = require('../../utils/auth');
const { validateBooking, validateQuery, validateReview, validateSpot } = require('../../utils/validation');
const { sequelize, Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const { Op } = require('sequelize');

const { adjustPojo } = require('../../utils/pojo')
const {dayDate, ymd} = require('../../utils/normalizeDate');
const { check } = require('express-validator');

const router = require('express').Router();


// DUPLICATED: refactor
async function bookingOk(startDate, endDate, next) {
    const specificErrText = "Sorry, this spot is already booked for the specified dates";
    const err = Error("Part of date range is already booked");
    console.log('bookingOk')
    console.log(startDate, endDate)
    startDate = dayDate(startDate);
    endDate = dayDate(endDate);
    const errors = {};
    const conflict = await Booking.findOne({
    where: {startDate: {[Op.lt]: ymd(endDate)},
            endDate: {[Op.gt]: ymd(startDate)}
    }});
    if (conflict) {
        const conflict2 = await Booking.findOne({
            where: {startDate: {[Op.lte]: ymd(startDate)},
                    endDate: {[Op.gt]: ymd(startDate)}
        }});
        if (conflict2) {errors.startDate = "Start date conflicts with an existing booking"; err.message = specificErrText;}
        const conflict3 = await Booking.findOne({
            where: {startDate: {[Op.lt]: ymd(endDate)},
                    endDate: {[Op.gte]: ymd(endDate)}
        }});
        if (conflict3) {errors.endDate = "End date conflicts with an existing booking"; err.message = specificErrText;}
    }
    if (conflict) {
        err.title = "Bad request";
        err.errors = errors;
        return unauthor(next, err);
    }
    else return true;
};


router.route('/:spotId(\\d+)/bookings')
    .get(requireAuth, async (req, res) => {
        const target = await Spot.findByPk(req.params.spotId);
        let attrClause; let clause; let isOwner;
        if (!target) return res.status(404).json({message: "Spot couldn't be found"});
        else if (isOwner = req.user.id === target.ownerId) {
            attrClause = {};
            clause = {include: {model: User, attributes: ['id', 'firstName', 'lastName']}}
        } else {
            attrClause = {attributes: ['spotId', 'startDate', 'endDate']};
            clause = {};
        };

        let Bookings = await Booking.findAll({
            ...clause,
            ...attrClause,
            where: {spotId: req.params.spotId},
        });
        if (isOwner) {
            Bookings = Bookings.map(b=>b.toJSON());
            Bookings = Bookings.map(b=>adjustPojo(b, ['User', 'id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']));
        }
        return res.json({Bookings});
    })
    .post(requireAuth, validateBooking, async (req, res, next) => {
      const spot = await Spot.findByPk(req.params.spotId);
      if (spot) { let booking;
        if (fitsAuthor(req, next, spot.id, false)){
          let {startDate, endDate} = req.body;
          if (startDate && endDate) {
            const ok = await bookingOk(startDate, endDate, next)
            if (ok) {
                booking = await Booking.create({
                    spotId: spot.id,
                    userId: req.user.id,
                    startDate,
                    endDate
          })};
          if (booking) return res.json(booking);
          else console.log('no booking in post bookings')
        }} else console.log('no fits: ', `${req.user.id} != ${spot.id}`)
      } else console.log('no spot in post bookings')
      return next(new Error('POST /spots/:id/bookinngs error'))
    });


router.post('/:spotId(\\d+)/images', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({message: "Spot couldn't be found"});
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
        if (!reviews.length) {
            const spot = await Spot.findByPk(req.params.spotId);
            if (!spot) return res.status(404).json({message: "Spot couldn't be found"});
        }
        return res.json({Reviews: reviews});
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
            attributes: { include: []  }  ,
            include: [
              { model: SpotImage,
                attributes: {exclude: ['spotId', 'createdAt', 'updatedAt']}},
              { model: User,
                as: 'Owner',
                attributes: {exclude: ['username', 'hashedPassword', 'email', 'updatedAt', 'createdAt']}}
                ],
        });
        if (!spot) return res.status(404).json({message: "Spot couldn't be found"});
        let reviewInfo = await Review.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('stars')), 'numReviews'],
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
            ],
            where: {spotId: spot.id}
        });
        reviewInfo = reviewInfo[0].toJSON();
        spot = spot.toJSON(); spot.numReviews = reviewInfo.numReviews; spot.avgRating = reviewInfo.avgRating;
        spot = adjustPojo(spot, ['id', 'ownerId', 'address', 'city','state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt', 'numReviews', 'avgRating', 'SpotImages', 'Owner']);
        return res.json(spot);
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
        } else return res.status(404).json({message: "Spot couldn't be found"});
  });


router.route('')
    .get(validateQuery, async (req, res) => {
    let {page,size,minLat,maxLat,minLng,maxLng,minPrice,maxPrice} = req.query;

    function checkMM (val, min, max) {
        if (min !== undefined && val < min) val = min;
        if (max !== undefined && val > max) val = max;
        return val;
    };
    function parseQueries (val, isOpt=true, min, max) {
        val = Number(val);
        val = isNaN(val)
          ? (isOpt ? undefined : min)
          : checkMM(val, min, max);
        return val;
    };
    page = parseQueries(page, false, 1, 10);
    size = parseQueries(size, true, 1, 20); // "optional" to set default later
    minLat = parseQueries(minLat);
    maxLat = parseQueries(maxLat);
    minLng = parseQueries(minLng);
    maxLng = parseQueries(maxLng);
    minPrice = parseQueries(minPrice, true, 0);
    maxPrice = parseQueries(maxPrice, true, 0);
    if (size === undefined) size = 20;
    const options = {};
    options.where = {};

    console.log (page,size,minLat,maxLat,minLng,maxLng,minPrice,maxPrice);

    if (minLat !== undefined) {
      if (maxLat !== undefined) {
        options.where.lat = {[Op.between]: [minLat, maxLat]};
      } else options.where.lat = {[Op.gte]: minLat};
    } else if (maxLat !== undefined)
        options.where.lat = {[Op.lte]: maxLat};

    if (minLng !== undefined) {
      if (maxLng !== undefined) {
        options.where.lng = {[Op.between]: [minLng, maxLng]};
      } else options.where.lng = {[Op.gte]: minLng};
    } else if (maxLng !== undefined)
      options.where.lng = {[Op.lte]: maxLng};

    if (minPrice !== undefined) {
      if (maxPrice !== undefined)
        options.where.price = {[Op.between]: [minPrice, maxPrice]};
      else options.where.price = {[Op.gte]: minPrice};
    } else if (maxPrice !== undefined)
      options.where.price = {[Op.lte]: maxPrice};

    console.log(options)


    let Spots = await Spot.findAll({
        include: [
            {   model: Review,
                required: false,
                attributes: ['stars']},
            { model: SpotImage,
                required: false,
                attributes: ['url'],
                where: {preview: true}},
        ],
        ...options,
        limit: size,
        offset: (page - 1) * size
    });
    Spots = Spots.map(e=>e.toJSON());
    Spots.forEach(s=>{s.avgRating =
        s.Reviews && s.Reviews.length && (s.Reviews.reduce((acc, next)=> acc + next.stars, 0) / s.Reviews.length);
        if (!s.avgRating) s.avgRating = null;
        delete s.Reviews;
        s.previewImage =
        s.SpotImages && s.SpotImages.length && s.SpotImages[0] && s.SpotImages[0].url
            ? s.SpotImages[0].url : null;
        delete s.SpotImages
    });
    return res.json({Spots, page, size});
    })
    .post(requireAuth, validateSpot, async (req, res) => {
        const {address, city, state, country, lat, lng, name, description, price} = req.body;
        let spot = await Spot.create({
            ownerId: req.user.id,
            address, city, state, country, lat, lng,
            name, description, price});
        if (spot) {
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
