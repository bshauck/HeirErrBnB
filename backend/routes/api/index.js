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

router.delete('/review-images/:imageId(\\d+)', requireAuth, (req, res) => {
  return res.status(500).json("Implementation TBD")
});
router.delete('/spot-images/:imageId(\\d+)', requireAuth, (req, res) => {
  return res.status(500).json("Implementation TBD")
});
// Add a XSRF-TOKEN cookie
router.get("/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  return res.status(200).json({'XSRF-Token': csrfToken})
});
router.post('/test',
  (req, res) => res.json({ requestBody: req.body }));

module.exports = router;
