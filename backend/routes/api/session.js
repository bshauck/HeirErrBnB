// backend/routes/api/session.js
const { check } = require('express-validator');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { getSafeUser } = require('../../utils/safeUser');
const { User } = require('../../db/models');
const router = require('express').Router();

const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];

// Restore session user
router.route('')
  .get((req, res) => {
    const response = {};
    response.user =
      (req.user) ? getSafeUser(req.user) : req.user;
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
    return res.json({ user: safeUser });
    }
  )
  // Log out
  .delete((_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});

module.exports = router;
