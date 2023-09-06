// backend/utils/auth.js
const csurf = require('csurf');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { secret, expiresIn } = jwtConfig;
const { User } = require('../db/models');

const isProduction = process.env.NODE_ENV === "production";
const tokenCookie = {
  secure: isProduction,
  sameSite: isProduction && "Lax",
  httpOnly: true
};

let csrfFunction=undefined;
function setCSRF() {
  if (!csrfFunction)
    csrfFunction = csurf({ cookie: tokenCookie });
}
const ROOT_IGNORE_LIST = ["/api/users", "/api/session"];
function csrfMiddleware(req, res, next) {
  if (ROOT_IGNORE_LIST.includes(req.url) && 'POST' === req.method) {
    next();
  } else {
    setCSRF();
    csrfFunction(req, res, next);
  }
};

// Sends a JWT Cookie
const setTokenCookie = async (res, user) => {
    // Create the token.
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );


    // Set the token cookie
    await res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      ...tokenCookie
    });

    return token;
};

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }

      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');
    return next();
  });
};


// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
};

/* Go to error handling if compare fails */
const fitsAuthor = function (req, next, compare, result=true) {
    if ((req.user.id === compare) === result) return true;

    const err = new Error('Forbidden');
    err.title = 'Forbidden';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err);
};

async function getCSRFToken(req, res) {
  const csrfToken = req.csrfToken();
  await res.cookie("XSRF-TOKEN", csrfToken);
  return csrfToken;
}


module.exports = { csrfMiddleware, fitsAuthor, getCSRFToken, restoreUser, requireAuth, setCSRF, setTokenCookie };
