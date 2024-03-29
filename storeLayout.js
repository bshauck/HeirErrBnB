/*
   {
     session: CD Spot user.spot, CD Review,
     spots:  // landing, details, CUD Spot
     reviews: // from all reviews for spot/user; CUD Review
     bookings:
     spotImages: // spot details only existing, CUD for Spot
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
         bookings: [bookingIds,], // all bookings (booking ids) of user
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
             numReviews: 4,
             avgRating: 4.5,

             // additional info; Details page gets images & reviews
             // reserve button gets bookings
             images: [spotImageIds,], // spotDetails
             reviews: [reviewIds,], // allSpotReviews
           },
       }
     // userQuery: { [userId]:[orderedSpotIdsBySomeInterestingCriteriaFromQuery], }
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
     edit: { [userId]: {[startDate|null, endDate|null]} }
     spot: { [spotId]: [[start,end],[start,end],] }
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
