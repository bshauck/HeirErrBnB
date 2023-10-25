/*
Most actionCreators will be found in the store .js file containing the reducer for that slice; but some are needed to be handled by multiple slices, and to avoid a circular reference we have to have a common external file that all dependendent slices import; similarly we have to have the constant used as the type available for all interested reducers
*/

export const CREATED_REVIEW = "reviews/CREATED_REVIEW";
export const CREATED_SPOT = "spots/CREATED_SPOT";

export const DELETED_REVIEW = "reviews/DELETED_REVIEW";

export const DELETED_SPOT = "spots/DELETED_SPOT";
export const READ_SPOT_REVIEWS = "reviews/READ_SPOT_REVIEWS"; /* spot */
export const READ_USER_REVIEWS = "reviews/READ_USER_REVIEWS"; /* session */
export const READ_SPOT = "spots/READ_SPOT"; /* session, spotImage */
export const READ_USER_SPOTS = "spots/READ_USER_SPOTS";
export const UPDATED_REVIEW = "reviews/UPDATED_REVIEW";
export const UPDATED_SPOT_REVIEW_RATINGS = "reviews/UPDATED_SPOT_REVIEW_RATINGS";

export const CREATED_BOOKING = "bookings/CREATED_BOOKING";
export const DELETED_BOOKING = "bookings/DELETED_BOOKING";
export const READ_SPOT_BOOKINGS = "bookings/READ_SPOT_BOOKINGS";
export const READ_USER_BOOKINGS = "bookings/READ_USER_BOOKINGS";
