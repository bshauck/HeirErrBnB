// backend/routes/api/index.js
const router = require('express').Router();
const { restoreUser, requireAuth } = require('../../utils/auth.js');

/* this needs to be first for all middleware */
router.use(restoreUser);

router.get('/restore-user', (req, res) =>
  res.json(req.user));

  /* eventually, can remove /test, /require-auth, /set-token-cookie */
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body })});

// GET /api/require-auth
router.get('/require-auth', requireAuth, (req, res) =>
    res.json(req.user));

// GET /api/set-token-cookie
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

module.exports = router;
