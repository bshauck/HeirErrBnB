// backend/routes/api/index.js
const router = require('express').Router();
const bookingsRouter = require('./bookings.js');
const reviewsRouter = require('./reviews.js');
const sessionRouter = require('./session.js');
const spotsRouter = require('./spots.js');
const usersRouter = require('./users.js');
const { fitsAuthor, getCSRFToken, requireAuth, restoreUser } = require('../../utils/auth');
const { Review, ReviewImage, Spot, SpotImage} = require('../../db/models');
const csurf = require('csurf')

/* this needs to be first for all middleware */
// router.post('/session', sessionRouter)
router.use('/users', usersRouter);
// above is failed attempt to put signup and login
// out of the way of security checks
router.use(restoreUser);

router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);
router.use('/bookings', bookingsRouter);
router.use('/session', sessionRouter);

router.delete('/review-images/:imageId(\\d+)', requireAuth, (req, res, next) => {
  return deleteImage(req, res, next, ReviewImage, Review, 'Review', 'reviewId', 'userId')
});
router.delete('/spot-images/:imageId(\\d+)', requireAuth, (req, res, next) => {
  return deleteImage(req, res, next, SpotImage, Spot, 'Spot', 'spotId', 'ownerId')
});


async function deleteImage(req, res, next, imageModel, holderModel, upStr, downStr, referStr) {
  const image = await imageModel.findByPk(req.params.imageId);
  if (!image) return res.status(404).json({message: `${upStr} Image couldn't be found`});
  const holder = await holderModel.findByPk(image[downStr]);
  if (fitsAuthor(req, next, holder[referStr])) {
    await image.destroy();
    return res.json({message: "Successfully deleted"})
  } else return next(new Error(`DELETE /${upStr.toLowerCase()}-images/:id error`))
}

// Add a XSRF-TOKEN cookie
router.get("/csrf/restore", async (req, res) => {
  const csrfToken = await getCSRFToken(req,res);
  return res.status(200).json({'XSRF-Token': csrfToken})
});
router.post('/test',
  (req, res) => res.json({ requestBody: req.body }));



module.exports = router;
