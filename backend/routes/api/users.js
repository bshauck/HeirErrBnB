// backend/routes/api/users.js
const { validateSignup } = require('../../utils/validation');
const { setCSRF, setTokenCookie } = require('../../utils/auth');
const { getSafeUser } = require('../../utils/safeUser');
const { User } = require('../../db/models');
const bcrypt = require('bcryptjs');
const router = require('express').Router();

// Sign up
router.post('', validateSignup, async (req, res, next) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = getSafeUser(user);
    await setTokenCookie(res, safeUser);
    req.user = user;
    if (!req.csrfToken) {try { setCSRF() } catch(e) {}}
    else res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.status(201).json({user: safeUser});
});

module.exports = router;
