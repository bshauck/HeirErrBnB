// backend/routes/api/index.js
const router = require('express').Router();
const bookingsRouter = require('./bookings.js');
const reviewsRouter = require('./reviews.js');
const sessionRouter = require('./session.js');
const spotsRouter = require('./spots.js');
const usersRouter = require('./users.js');
const { restoreUser, requireAuth } = require('../../utils/auth.js');

/* this needs to be first for all middleware */
router.use(restoreUser);

router.use('/bookings', bookingsRouter);
router.use('/reviews', reviewsRouter);
router.use('/session', sessionRouter);
router.use('/spots', spotsRouter);
router.use('/users', usersRouter);

router.delete('/spot-images', requireAuth, (req, res) => {
});

router.delete('/review-images', requireAuth, (req, res) => {
});


router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
