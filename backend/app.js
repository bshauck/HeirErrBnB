const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();
app.use(morgan('dev')); // logging
app.use(cookieParser());
app.use(express.json());

// Security
if (!isProduction) // enable cors only in development
    app.use(cors());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(csurf({ // Set the _csrf token; req.csrfToken method
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
}));


// backend/app.js
const routes = require('./routes');

// ...

app.use(routes); // Connect all the routes


// backend/app.js
// ...

module.exports = app;
