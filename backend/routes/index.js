// backend/routes/index.js
const express = require('express');
const router = express.Router();

router.get('/hello/world', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken())
    res.send("Hello World!")
})

router.use('/api', require('./api'));

module.exports = router;
