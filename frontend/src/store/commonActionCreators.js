/*
Most actionCreators will be found in the store .js file containing the reducer for that slice; but some are needed to be handled by multiple slices, and to avoid a circular reference we have to have a common external file that all dependendent slices import; similarly we have to have the constant used as the type available for all interested reducers
*/

export const READ_SPOT_REVIEWS = "reviews/READ_SPOT_REVIEWS"; /* spot */
export const READ_USER_REVIEWS = "reviews/READ_USER_REVIEWS"; /* session */
export const READ_SPOT = "spots/READ_SPOT"; /* session */
