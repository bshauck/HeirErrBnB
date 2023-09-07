// backend/routes/api/session.js
const { check } = require('express-validator');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { validateLogin } = require('../../utils/validation');
const { restoreUser, setTokenCookie } = require('../../utils/auth');
const { getSafeUser } = require('../../utils/safeUser');
const { User } = require('../../db/models');
const router = require('express').Router();


// Restore session user
router.route('')
  .get((req, res) => {
    const response = {};
    response.user = req.user
      ? getSafeUser(req.user) : req.user;
    return res.json(response);
  })
  // Log in
  .post(validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }

    const safeUser = getSafeUser(user);
    await setTokenCookie(res, safeUser);
    req.user = user;
    if (req.csrfToken) res.cookie('XSRF-TOKEN', req.csrfToken())
    return res.json({ user: safeUser });
    }
  )
  // Log out
  .delete((_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});

module.exports = router;
