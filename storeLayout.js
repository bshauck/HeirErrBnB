
/*
new STORE layout (except since users cannot be deleted, and all
    creation happens in signin of session, we are combining users
    with session currently, they are never listed or ordered)

   {
     session: CD Spot user.spot, CD Review,
     spots:  // landing, details, CUD Spot
     reviews: // from all reviews for spot/user; CUD Review
   //  bookings: // TODO
     spotImages: // spotdetails only existing, CUD for Spot
     reviewImages: // from all reviews for spot/user; CUD for Review
   },
   */
   /* session */ /*
  {
    user: current user || null
    id: // normalized user info
    {
     [userId]:
       { // partial from review reads
         id,
         firstName,
         lastName,

         // additional detail on login (passwords only in db)
         email,
         username,

         // additional detail w/ current spots/review/bookings
         spots: [spotIds,],
         reviews: [reviewIds,], // all reviews of user
         bookings: [bookingIds,], // TODO
         // spotQuery: [landingPageQueryParamString], // TODO
         // currentPage: 3 // last displayed page of info // TODO
       }
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
             previewUrl: "image.jpg",
             createdAt: "2021-11-19 20:39:36",
             updatedAt: "2021-11-19 20:39:36",
             numReviews: 4, // filled in with detailspot
             avgRating: 4.5, // filled in with detailspot

             // additional info; Details page gets images & reviews
             // reserve button gets bookings
             images: [spotImageIds,], // spotDetails
             reviews: [reviewIds,], // allSpotReviews
             // bookings: [bookingIds,], // perhaps only ids with future endDates
           },
       }
     // userQuery: { [userId]: [orderedSpotIdsBySomeInterestingCriteriaFromQuery], }
   }
   */

   /* reviews */ /* interested in spot delete */ /*
   {
     id: // from all reviews for spot/user; CUD Review; D Spot
       {
         [reviewId]:
           {
             id,
             userId,
             spotId,
             commentary, // renamed review column
             stars, // 1-5

             // additional details
             firstName; allUser/SpotReviews;
             images: [reviewImageIds,] // allSpot/UserReviews
           },
       }
     spotLatest: { [spotId]: [idsOrderedByDescUpdatedDate], } // allSpotReviews
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
  id:
    {
      [imageId]:
        {
          id,
          spotId,
          url
        }
    }
  spot:
    {
      [spotId]; [imageIds,]
    }
}
*/

/* reviewImages */ /*
{ // spot/user reviews; CUD for Review
  id:
    {
      [imageId]:
        {
          id,
          revoewId,
          url
        }
    }
  review:
    {
      [reviewId]; [imageIds,]
    }
  }
}
*/



   // API calls
let res;
   // Signup/Login/getCurrentUser user info
res = {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith"
    }
  }
  // logout/delete things no info
  // createSpot/editSpot
res =
{
  "id": 1,
  "ownerId": 1,
  "address": "123 Disney Lane",
  "city": "San Francisco",
  "state": "California",
  "country": "United States",
  "lat": 37.7645358,
  "lng": -122.4730327,
  "name": "App Academy",
  "description": "Place where web developers are created",
  "price": 123,
  "previewUrl": "image.jpg",
  "createdAt": "2021-11-19 20:39:36",
  "updatedAt": "2021-11-19 20:39:36"
}

  // gatAllSpots/getUserSpots adds
res =
{
  "Spots": [
    {
      "avgRating": 4.5,
    }
  ]
}

// getSpotDetailsById adds to above:
res =
{
  "numReviews": 5,
  "SpotImages": [
    {
      "id": 1,
      "url": "image url",
    },
  ],
  "Owner": {
    "id": 1,
    "firstName": "John",
    "lastName": "Smith"
  }
}

// addImageToSpotById
res =
[ // if single object given, single returned
{
"id": 1,
"url": "image url",
}
]

// createReviewBySpotId/edit
res =
{
  "id": 1,
  "userId": 1,
  "spotId": 1,
  "commentary": "This was an awesome spot!",
  "stars": 5,
  "createdAt": "2021-11-19 20:39:36",
  "updatedAt": "2021-11-19 20:39:36"
}

// reviewsBySpotId adds
res =
{
  "Reviews": [
    {
      "User": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith"
      },
      "ReviewImages": [
        {
          "id": 1,
          "url": "image url"
        }
      ],
    }
  ]
}
// currentUserReviews add to the above
res =
{
      "Spot": {
        "id": 1,
        "ownerId": 1,
        "address": "123 Disney Lane",
        "city": "San Francisco",
        "state": "California",
        "country": "United States",
        "lat": 37.7645358,
        "lng": -122.4730327,
        "name": "App Academy",
        "price": 123,
        "previewUrl": "image url"
      },
    }


// No booking or review image info yet


/* Ponder
    add numReviews=0, avgRating=null, reviews=[] to Spot
      creation in frontend (edit too if not pre-existing)
    possibly eventually API creation/edit

    only SpotImage info is spotDetails
    also only source of API numReviews
      (could easily be added to API getAll/UserSpots)

      add numReviews and avgRating to all
*/

/* extra info frontend will hold and when to get it
  partial user with       spotDetails / allSpotReviews
  full with                 // login/signup
  extra is
    spots: [spotIds,],      // allUserSpots; CD Spot
    reviews: [reviewIds,],  // allUserReviews, CD Review
So, listen for spotDetails / allSpotReviews and ensure
partial users are there (if so, just return state)
listen for allUserSpots & CD Spot and update spots
listen for allUserReviews and CD Review and update reviewIds

  Spot
    avgRating: 4.5,           // getAll/UserSpots, CUD Review
    numReviews: 4,            // spotDetails, CD Review
    images: [spotImageIds,],  // spotDetails, CD SpotImage
    reviews: [reviewIds,],    // allSpotReviews, CD Review
  add userId to allUserSpots

  Review
    firstName // sllUser/SpotReviews
    images: [reviewImageIds,] // allSpot/UserReviews CD RevImage
  spotLatest: { [spotId]: [idsOrderedByDescUpdatedDate], } // allSpotReviews, CD Spot

  bookings TBD
  reviewImages TBD
*/



/* steps for user spots (Manage spots)

    1. See if you have user.spots (spotIds)
    2a. If so, see if missing any of in store
    3a1. If missing any, delete User.spots and goto 1.

    2b. If not, get user.spots by hitting db, once and rerender

*/
