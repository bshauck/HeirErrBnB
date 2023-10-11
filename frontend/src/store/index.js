import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import spotsReducer from "./spots";
import reviewsReducer from "./reviews";
// import bookingsReducer from "./bookings";

/* New store shape (see each slice for details)
{
  session:
  users:
  spots:
  reviews:
//  bookings: // TODO
  spotImages:
  reviewImages:
},
*/

const rootReducer = combineReducers({
  session: sessionReducer,
  users: [],
  spots: spotsReducer,
  reviews: reviewsReducer,
  // bookings: bookingsReducer
  spotImages: [],
  reviewImages: []
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
