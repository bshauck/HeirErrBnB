
/*
new STORE layout (except since users cannot be deleted, and all
    creation happens in signin of session, we are combining users
    with session currently, they are never listed or ordered)

   {
     session:
     users: // session signup creates
     spots:  // landing, details, CUD Spot
     reviews: // from all reviews for spot/user; CUD Review
   //  bookings: // TODO
     spotImages: // spotdetails only existing, CUD for Spot
     reviewImages: // from all reviews for spot/user; CUD for Review
   },
   */
   /* session */ /*
   {
     user: user || null,
     id: (really all the user stuff below goes here)
   }
   */

   /* users */ /* interested in spot/booking/review delete */ /*
   {
     [userId]:
       {
         id,
         firstName,
         lastName,

         // additional detail on login
         email,
         username,
         createdAt,  /// TODO?
         updatedAt   /// TODO?

         // additional detail w/ current spots/review/bookings
         spots: [spotIds,],
         reviews: [reviewIds,], // all reviews of user
         // bookings: [bookingIds,], // TODO
         // spotQuery: [landingPageQueryParamString], // TODO
         // currentPage: 3 // last displayed page of info // TODO
       }
   }
   */
   /* spots */ /*
   {
     id:
       {
         [spotId]:
           {
             id: 1,
             ownerId: 1,
             address: "123 Disney Lane",
             city: "San Francisco",
             state: "California",
             country: "United States",
             lat: 37.7645358,
             lng: -122.4730327,
             name: "App Academy",
             description: "Place where web developers are created",
             price: 123,
             createdAt: "2021-11-19 20:39:36",
             updatedAt: "2021-11-19 20:39:36",
             numReviews: 4, // filled in with detailspot
             avgRating: 4.5,
             previewUrl: "image.jpg",

             // additional info; Details page gets images & reviews
             // reserve button gets bookings
             images: [spotImageIds,], // filled in with detailedspot (singleSpot)
             reviews: [reviewIds,], // filled in with detailedspot (singleSpot)
             // bookings: [bookingIds,], // perhaps only ids with future endDates
           },
       }
     userQuery: { [userId]: [orderedSpotIdsBySomeInterestingCriteriaFromQuery], }
   }
   */

   /* reviews */ /* interested in spot delete */ /*
   {
     id: // from all reviews for spot/user; CUD
       {
         [reviewId]:
           {
             id,
             userId,
             spotId,
             commentary, // renamed review column
             stars, // 1-5

             // additional details
             images: [reviewImageIds,] // from all reviews for spot/user
           },
       }
     spotLatest: { [spotId]: [idsOrderedByDescUpdatedDate], } // from all reviews for spot
   }
   */

   /* bookings */ /* interested in spot/user delete */ /*
   {
     id:
       {
         [bookingId]:
           {
             id,
             userId,
             spotId,
             startDate,
             endDate,
             createdAt,
             updatedAt
           },
       }
     spot: { [spotId]: [idsOrderedBySpotAndAscFutureEndDatePerhaps], }
     user: { [userId]: [idsOrderedByUserAndAscFutureEndDatePerhaps], }
   }
   */

   /* spotImages */ /*
   {  // spotdetails only existing, CUD for Spot
     [imageId]:
       {
         id,
         spotId,
         url
       }
   }
   */

   /* reviewImages */ /*
   { // from all reviews for spot/user; CUD for Review
     [imageId]:
       {
         id,
         reviewId,
         url
       }
   }

   */
