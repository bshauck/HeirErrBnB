// backend/routes/index.js
const express = require('express');
const router = express.Router();

router.get('/hello/world', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken())
    res.send("Hello World!")
})
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.json({ 'XSRF-Token': csrfToken });
});
router.use('/api', require('./api'));

// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    // Serve the front-end's index.html file at the root route
    router.get('/', (req, res) => {
      res.cookie('XSRF-TOKEN', req.csrfToken());
      return res.sendFile(
        path.resolve(__dirname, '../../frontend', 'build', 'index.html')
      );
    });

    // Serve the static assets in the front-end's build folder
    router.use(express.static(path.resolve("../frontend/build")));

    // Serve the front-end's index.html file at all other routes NOT starting with /api
    router.get(/^(?!\/?api).*/, (req, res) => {
      res.cookie('XSRF-TOKEN', req.csrfToken());
      return res.sendFile(
        path.resolve(__dirname, '../../frontend', 'build', 'index.html')
      );
    });
  }

    // Add a XSRF-TOKEN cookie in development
    if (process.env.NODE_ENV !== 'production') {
      router.get('/api/csrf/restore', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return res.json({});
      });
    }


module.exports = router;
