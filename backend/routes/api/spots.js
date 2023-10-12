const { fitsAuthor, requireAuth, unauthor } = require('../../utils/auth');
const { validateBooking, validateEditSpot, validateQuery, validateReview, validateSpot } = require('../../utils/validation');
const { sequelize, Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const { Op } = require('sequelize');
const { adjustPojo } = require('../../utils/pojo')
const {dayDate, ymd} = require('../../utils/normalizeDate');

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
          })} else return;
          if (booking) return res.status(201).json(booking);
          else return res.status(500).json({message: 'Booking creation failed'});
        }}
      } else return res.status(404).json({message: "Spot couldn't be found"})
      return next(new Error('POST /spots/:id/bookinngs error'))
    });

// now takes {urls: ["url1", "url2", ...]};
router.post('/:spotId(\\d+)/images', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({message: "Spot couldn't be found"});
    if (fitsAuthor(req, next, spot.ownerId)) {
        let { url, urls } = req.body;
        values = Array.isArray(urls)
        ? urls.map(u => ({spotId: spot.id, url: u}))
        : [{spotId: spot.id, url}]
        let images = await SpotImage.bulkCreate(values);

        if (images) {
            images = images.map(i=>i.toJSON());
            images.forEach(image => {
                delete image.createdAt;
                delete image.updatedAt;
            });
            if (images?.length === 1) images = images[0];
            console.log(images)
            return res.status(201).json(images);
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
            order: [["updatedAt", "DESC"]]
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
        if (old) return res.status(403).json({message: "User already has a review for this spot"});
        const {commentary, stars} = req.body;
        const newReview = await Review.create({
            userId: req.user.id,
            spotId: spot.id,
            commentary,
            stars
        });
        let foo = newReview.toJSON();
        foo.User = {id:req.user.id, firstName: req.user.firstName, lastName: req.user.lastName}
        return res.status(201).json(foo);
    });


router.get('/current', requireAuth, async (req, res) => {
    let Spots = await Spot.findAll({
        include: [
            {
                model: Review,
                attributes: ['id','stars']
            },
        ],
        where: {ownerId: req.user.id}
    });
    Spots = Spots.map(e=>e.toJSON());
    Spots.forEach(s=>{s.avgRating =
        s.Reviews && s.Reviews.length && (s.Reviews.reduce((acc, next)=> acc + next.stars, 0) / s.Reviews.length);
        s.numReviews = s.Reviews.length;
        if (!s.avgRating) s.avgRating = null;
        s.reviews = s.Reviews.map(r=>r.id);
        delete s.Reviews;
    });
    return res.json({Spots});
})

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
                attributes: {exclude: ['createdAt', 'updatedAt']}},
              { model: User,
                as: 'Owner',
                attributes: {exclude: ['username', 'hashedPassword', 'email', 'updatedAt', 'createdAt']}},
                {
                    model: Review,
                    attributes: ['id','stars']
                }
                ],
        });
        if (!spot) return res.status(404).json({message: "Spot couldn't be found"});
        spot = spot.toJSON();
        spot.avgRating =
            spot.Reviews && spot.Reviews.length && (spot.Reviews.reduce((acc, next)=> acc + next.stars, 0) / spot.Reviews.length);
            spot.numReviews = spot.Reviews.length;
            if (!spot.avgRating) spot.avgRating = null;
            spot.reviews = spot.Reviews.map(r=>r.id)
            delete spot.Reviews;
        spot = adjustPojo(spot, ['id', 'ownerId', 'address', 'city','state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'previewUrl', 'createdAt', 'updatedAt', 'numReviews', 'avgRating', 'SpotImages', 'Owner', 'reviews']);
        return res.json(spot);
    })
    .put(requireAuth, validateEditSpot, async (req, res, next) => {
        let spot = await Spot.findByPk(req.params.spotId);
        if (spot) {
            if (fitsAuthor(req, next, spot.ownerId)) {
            const {address, city, state, country, lat, lng, name, description, price, previewUrl} = req.body;
            if (address) spot.address = address;
            if (city) spot.city = city;
            if (state) spot.state = state;
            if (country) spot.country = country;
            if (lat) spot.lat = lat;
            if (lng) spot.lng = lng;
            if (name) spot.name = name;
            if (description) spot.description = description;
            if (price) spot.price = price;
            if (previewUrl) spot.previewUrl = previewUrl;
            await spot.save();
            spot = spot.toJSON();
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
    size = parseQueries(size, true, 1, 50); // "optional" to set default later
    minLat = parseQueries(minLat);
    maxLat = parseQueries(maxLat);
    minLng = parseQueries(minLng);
    maxLng = parseQueries(maxLng);
    minPrice = parseQueries(minPrice, true, 0);
    maxPrice = parseQueries(maxPrice, true, 0);
    if (size === undefined) size = 50;
    const options = {};
    options.where = {};

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

    let Spots = await Spot.findAll({
        include: [
            {   model: Review,
                required: false,
                attributes: ['id', 'stars']},
        ],
        ...options,
        limit: size,
        offset: (page - 1) * size,
        required: false
    });
    Spots = Spots.map(e=>e.toJSON());
    Spots.forEach(s=>{s.avgRating =
        s.Reviews && s.Reviews.length && (s.Reviews.reduce((acc, next)=> acc + next.stars, 0) / s.Reviews.length);
        s.numReviews = s.Reviews.length;
        if (!s.avgRating) s.avgRating = null;
        s.reviews = s.Reviews.map(r=>r.id)
        delete s.Reviews;
    });
    return res.json({Spots, page, size});
    })
    .post(requireAuth, validateSpot, async (req, res) => {
        const {address, city, state, country, lat, lng, name, description, price, previewUrl} = req.body;
        let spot = await Spot.create({
            ownerId: req.user.id,
            address, city, state, country, lat, lng,
            name, description, price, previewUrl});
        if (spot) {
            return res.status(201).json(spot);
        }
        return next(new Error('POST /spots error'))
        });



module.exports = router;
