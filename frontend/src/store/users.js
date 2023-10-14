/* users store shape
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
        updatedAt,   /// TODO?

        // additional detail if asked for current info
        spots: [spotIds],
        reviews: [reviewIds,],
        // bookings: [bookingIds,], // endDates in future
        // pastBookings: [bookingIds,] // endDates in past
      }
}
*/
