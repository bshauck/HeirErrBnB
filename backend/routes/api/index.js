// backend/routes/api/index.js
const router = require('express').Router();
const { restoreUser, requireAuth } = require('../../utils/auth.js');

/* this needs to be first for all middleware */
router.use(restoreUser);


module.exports = router;
