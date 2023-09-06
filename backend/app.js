const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
// const csurf = require('csurf');
const { csrfMiddleware } = require('./utils/auth');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');

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

// Create middleware to check request url
// allow login and signup without token
app.use(csrfMiddleware);
// app.use(csurf({ // Set the _csrf token; req.csrfToken method
//       cookie: {
//         secure: isProduction,
//         sameSite: isProduction && "Lax",
//         httpOnly: true
//       }
// }));


// backend/app.js
const routes = require('./routes');
app.use(routes); // Connect all the routes

// catch unimplemented API attempts
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
  });

// Unpack Sequelize errors
app.use((err, _req, _res, next) => {
    if (err instanceof ValidationError) {
      let errors = {};
      for (let error of err.errors) {
        errors[error.path] = error.message;
      }
      err.title = 'Validation error';
      err.errors = errors;
    }
    next(err);
  });

  // Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
      title: err.title || 'Server Error',
      message: err.message,
      errors: err.errors,
      stack: isProduction ? null : err.stack
    });
  });

module.exports = app;
