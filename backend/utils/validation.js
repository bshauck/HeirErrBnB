// backend/utils/validation.js
const { body, check, query, validationResult } = require('express-validator');
const { /*dayDate,*/ ymd } = require('./normalizeDate')

const validateQuery = [
  query('page')
    .optional()
    .notEmpty()
    .bail()
    .isNumeric()
    .isInt({min: 1})
    .withMessage("Page must be greater than or equal to 1"),
    query('size')
    .optional()
    .notEmpty()
    .bail()
    .isNumeric()
    .isInt({min: 1})
    .withMessage("Size must be greater than or equal to 1"),
    query('maxLat')
    .optional()
    .exists({values: "null"})
    .bail()
    .isFloat({min:-90, max:90})
    .withMessage("Maximum latitude is invalid"),
    query('minLat')
    .optional()
    .exists({values: "null"})
    .bail()
    .isFloat({min:-90, max:90})
    .withMessage("Minimum latitude is invalid"),
    query('maxLng')
    .optional()
    .exists({values: "null"})
    .bail()
    .isFloat({min:-180, max:180})
    .withMessage("Maximum longitude is invalid"),
    query('minLng')
    .optional()
    .exists({values: "null"})
    .bail()
    .isFloat({min:-180, max:180})
    .withMessage("Minimum longitude is invalid"),
    query('minPrice')
    .optional()
    .exists({values: "null"})
    .bail()
    .isFloat({min: 0})
    .withMessage("Minimum price must be greater than or equal to 0"),
    query('maxPrice')
    .optional()
    .exists({values: "null"})
    .bail()
    .isFloat({min: 0})
    .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
];

const validateLogin = [
  check('credential')
    .trim()
    .exists({ values: "falsy" })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .trim()
    .exists({ values: "falsy" })
    .notEmpty()
    .withMessage('Please provide a password.')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more'),
  handleValidationErrors
];

const validateSignup = [
  check('email')
    .trim()
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('firstName')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check('lasstName')
    .trim()
    .exists({values: ''})
    .withMessage("Last Name is required"),
  check('username')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Username is required")
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.')
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
    .withMessage('Name is required')
    .isLength({max: 49})
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
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage('Start date is required')
    .bail()
    // .isDate(new Date(body('startDate')))
    // .withMessage('startDate must be a Date')
    // .bail()
    .isAfter(ymd(new Date()))
    .withMessage('Must book in the future'),
    check('endDate')
    .trim()
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage('End date is required')
    .bail()
    // .isDate(dayDate(new Date(body('endDate'))))
    // .withMessage('End date must be a Date')
    // .bail()
    .isAfter(ymd(new Date()))
    .withMessage('Must book in the future'),
    // .bail()
    // .isBefore(body('startDate').toDate().toDateString())
    // .withMessage('endDate cannot be on or before startDate'),
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

    const err = Error("Bad request");
    err.errors = errors;
    err.status = 400;
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors, validateBooking, validateLogin, validateQuery, validateReview, validateSignup, validateSpot
};
