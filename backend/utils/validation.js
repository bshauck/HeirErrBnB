// backend/utils/validation.js
const { body, check, validationResult } = require('express-validator');

const validateSignup = [
  check('email')
    .trim()
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .trim()
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .trim()
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .trim()
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

const validateSpot = [
  check('address')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  check('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  check('lat')
    .trim()
    .if(body('lat').notEmpty())
    .isFloat({min: -90, max: 90})
    .withMessage('Latitude is not valid'),
  check('lng')
    .trim()
    .if(body('lng').notEmpty())
    .isFloat({min: -180, max: 180})
    .withMessage('Longitude is not valid'),
  check('name')
    .trim()
    .notEmpty()
    .isLength({max: 50})
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  check('price')
    .trim()
    .exists({ values: "falsy" })
    .notEmpty()
    .isInt()
    .withMessage('Price per day is required'),
  handleValidationErrors
];

const validateReview = [
  check('review')
    .trim()
    .notEmpty()
    .withMessage('Review text is required'),
  check('stars')
    .trim()
    .notEmpty()
    .isInt({min: 1, max: 5})
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

const validateBooking = [
  check('startDate')
    .trim()
    .notEmpty()
    // .isDate()
    .withMessage('startDate must be a Date')
    // .isAfter((new Date()).toString())
    .withMessage('Must book in the future')
    // .isBefore(body('endDate').toDate())
    .withMessage('endDate cannot be on or before startDate'),
  check('endDate')
    .trim()
    .notEmpty()
    // .isDate()
    .withMessage('endDate must be a Date'),
  handleValidationErrors
];


// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
function handleValidationErrors(req, _res, next){
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors, validateBooking, validateReview, validateSignup, validateSpot
};
