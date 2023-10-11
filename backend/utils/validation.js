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
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more'),
  handleValidationErrors
];

const validateSignup = [
  check('email')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('firstName')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check('lastName')
    .trim()
    .exists({values: "falsy"})
    .withMessage("Last Name is required"),
  check('username')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.')
    .bail()
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

const spotAddress =
  check('address')
    .trim()
    .notEmpty()
    .withMessage('Street address is required');
const spotCity =
  check('city')
    .trim()
    .notEmpty()
    .withMessage('City is required');
const spotState =
  check('state')
    .trim()
    .notEmpty()
    .withMessage('State is required');
const spotCountry =
  check('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required');
const spotLat =
  check('lat')
    .trim()
    .if(body('lat').notEmpty())
    .isFloat({min: -90, max: 90})
    .withMessage('Latitude is not valid');
const spotLng =
  check('lng')
    .trim()
    .if(body('lng').notEmpty())
    .isFloat({min: -180, max: 180})
    .withMessage('Longitude is not valid');
const spotName =
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isLength({max: 49})
    .withMessage('Name must be less than 50 characters');
const spotDescription =
  check('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required');
const spotPrice =
  check('price')
    .trim()
    .exists({ values: "falsy" })
    .notEmpty()
    .isInt({min: 0})
    .withMessage('Price per day is required');
const spotPreviewUrl =
    check('previewUrl')
      .trim()
      .notEmpty()
      .withMessage('Preview URL is required');

const validateSpot = [
  spotAddress, spotCity, spotState, spotCountry, spotLat,
  spotLng, spotName, spotDescription, spotPrice, spotPreviewUrl,
  handleValidationErrors
];
const validateEditSpot = [
  spotAddress.optional(),
  spotCity.optional(),
  spotState.optional(),
  spotCountry.optional(),
  spotLat.optional(),
  spotLng.optional(),
  spotName.optional(),
  spotDescription.optional(),
  spotPrice.optional(),
  spotPreviewUrl.optional(),
  handleValidationErrors
];



const validateReview = [
  check('commentary')
    .trim()
    .notEmpty()
    .withMessage('Commentary is required'),
  check('stars')
    .trim()
    .notEmpty()
    .isInt({min: 1, max: 5})
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

const bookingStartDate =
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
    .withMessage('Must book in the future');
const bookingEndDate =
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
    .withMessage('Must book in the future');
    // .bail()
    // .isBefore(body('startDate').toDate().toDateString())
    // .withMessage('endDate cannot be on or before startDate'),

const validateBooking = [
      bookingStartDate,
      bookingEndDate,
      handleValidationErrors
];

const validateEditBooking = [
  bookingStartDate.optional(),
  bookingEndDate.optional(),
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

    const err = Error("Bad Request");
    err.errors = errors;
    err.status = 400;
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors, validateBooking, validateEditBooking, validateEditSpot, validateLogin, validateQuery, validateReview, validateSignup, validateSpot
};
