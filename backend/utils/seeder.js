const { Review, Spot, User } = require('../db/models');
const { dayDate } = require('./normalizeDate');

const seederUserNames = [
    'Demo-lition',
    'FakeUser1',
    'FakeUser2'
];
const seederSpotNames = [
    'Cheap Denton House',
    'Boulder Shack',
    'Ski Out'
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

  SEEDDATE = new Date(new Date().toDateString());
  DATEINC = 1;
  SEEDDATE.setMonth(SEEDDATE.getMonth()+1);
  function seederNextDate() {
    SEEDDATE = new Date(SEEDDATE.setDate(SEEDDATE.getDate()+ ++DATEINC));
    return SEEDDATE
  };
  seederNextDate();

const seederImageURLs = [
  'https://a0.muscache.com/im/pictures/miso/Hosting-7742780/original/3bbf8900-9bde-4203-b66c-85e062682cae.jpeg?im_w=960',
'https://a0.muscache.com/im/pictures/cbf6ff83-dc6e-4da0-b68c-75c0e6139560.jpg?im_w=720'
];

module.exports = {seederImageURLs, seederNextDate, seederReviewIds, seederSpotIdAndOwners, seederSpotNames, seederUserIds, seederUserNames }
