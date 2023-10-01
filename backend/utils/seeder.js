const { Review, Spot, User } = require('../db/models');

/* unique usernames find seeded users */
const seederUserNames = [
    'Demo-lition',
    'francoportin',
    'aleckeeler',
    'anthonylovern',
    'joshgoldberg',
    'adamtifrit',
    'elliotstarr',
    'haydengogan',
    'jondiez',
    'masonaustin',
    'stevenielson',
    'lanoribello',
    'miraborkowska'
];
/* unique names find seeded spots */
const seederSpotNames = [
    'Cheap Denton House',
    'Boulder Shack',
    'Ski Out',
    'Warmth in Winter',
    'Summer Passion',
    'Winter Paradise',
    'A Steal at Any Price',
    'Extravaganza',
    'Humble Beginnings',
    'Pride of the Center',
    'Rampaging Fun',
    'Serenity',
    'Courage',
    'Wisdom',
    'Peace',
    'Cheap Berlin House',
    'Strange Lobster Shack',
    'Ski Up, down and all around',
    'Warmth in My Heart',
    'Summer Fun For Everyone',
    'Fall and Get Back Up Paradise',
    'A Steal at Any Exuberance',
    'Extravaganza and Lollapalooza',
    'Humble Beginnings and Furtive Endings',
    'Pride of the Center, Pack at the Back',
    'Rampaging Fun in the Stolid Sun',
    'Serenity is the Goal of Many',
    'Courage can be Found Everywhere',
    'Wisdom is Rarer than Most Think',
    'Peace is Hard to Find'
];

const seederUserIds = async () => {
  let users = await User.findAll({
    attributes: ['id'],
    where: {username: seederUserNames}
  });
  users = users.map(u=>u.toJSON())
  return users.map(e=>e.id);
}

const seederSpotIdAndOwners = async () => {
  let spots = await Spot.findAll({
    attributes: ['id','ownerId'],
    where: {name: seederSpotNames}
  });
  spots = spots.map(e=>e.toJSON());
  return spots
}

  const seederReviewIds = async () => {
    let idsAndOwners = await seederSpotIdAndOwners();
    let spotIds = idsAndOwners.map(e=>e.id)
    let reviews = await Review.findAll({
    attributes: ['id'],
    where: {spotId: spotIds}
  });
  reviews = reviews.map(r=>r.toJSON())
  return reviews.map(e=>e.id);
}


const seederImageURLs = [
  'https://a0.muscache.com/im/pictures/miso/Hosting-7742780/original/3bbf8900-9bde-4203-b66c-85e062682cae.jpeg?im_w=960',
'https://a0.muscache.com/im/pictures/cbf6ff83-dc6e-4da0-b68c-75c0e6139560.jpg?im_w=720'
];

// Returns a random integer between min (inclusive) and max (inclusive).
// Neither max nor min have to be an int.
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { getRandomInt, seederImageURLs, seederReviewIds, seederSpotIdAndOwners, seederSpotNames, seederUserIds, seederUserNames }
