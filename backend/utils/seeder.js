const { Review, Spot, User } = require('../db/models');

const seederUserNames = [
    'Demo-lition',
    'FakeUser1',
    'FakeUser2'
];
const seederSpotNames = [
    'Cheap Apartment',
    'Mountain Home',
    'Ski Out'
];

const seederUserIds = async () => (await User.findAll({
    attributes: ['id'],
    where: {username: seederUserNames}
  })).map(e=>e.id);

const seederSpotIds = async () => (await Spot.findAll({
    attributes: ['id'],
    where: {name: seederSpotNames}
  })).map(e=>e.id);

  const seederReviewIds = async () => (await Review.findAll({
    attributes: ['id'],
    where: {spotId: await seederSpotIds()}
  })).map(e=>e.id);

  let aDate = Date.now();
  const dayMilliseconds = 1000 * 60 * 60 * 24;
  const seederNextDate = () => aDate = new Date(aDate.valueOf() + dayMilliseconds);
  seederNextDate();

const seederImageURLs = [
  'https://a0.muscache.com/im/pictures/miso/Hosting-7742780/original/3bbf8900-9bde-4203-b66c-85e062682cae.jpeg?im_w=960',
'https://a0.muscache.com/im/pictures/cbf6ff83-dc6e-4da0-b68c-75c0e6139560.jpg?im_w=720'
];

module.exports = {seederImageURLs, seederNextDate, seederReviewIds, seederSpotIds, seederSpotNames, seederUserIds, seederUserNames }
