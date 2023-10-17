const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../db/models');

/* unique usernames find seeded users */
const seederUserNames = [
    'Demo-lition',
    'francoportin',
    'aleckeeler',
    'anthonylovern',
    'joshgoldenberg',
    'adamtifrit',
    'elliotstarr',
    'haydengogan',
    'jondiez',
    'masonaustin',
    'stevenielson',
    'lanoribello',
    'miraborkowska'
];

const reviewText1 = [
  "Horrible decor and smell",
  "The fridge had a rancid smell",
  "There were no towels and the host didn't respond to calls",
  "The key combination given was wrong, and it took 3 hours to get inside",
  "There was dog and cat hair everywhere, and I'm allergic",
  "The description said 2 bedrooms, but there was only l and a fold-out sofa",
];
const reviewText2 = [
  "Mildly distressing decor and smell",
  "The fridge had a faint smell",
  "There was 1 towel and the host took 2 hours to respond to calls",
  "The key combination given was wrong, and it took 20 minutes to get inside",
  "I saw a roach",
  "Bed was uncomfortable",
];
const reviewText3 = [
  "it was ok",
  "Not the worst place I've been",
  "I've had better",
  "Plenty of cold water, not much hot",
  "Said 3 TVs, but there were only 2",
  "No mint on the pillows",
];
const reviewText4 = [
  "Mints on the pillows!",
  "The host was very friendly and helpful",
  "Had a better time than I expected",
  "Host gave fresh fruit every day",
  "Really good breakfasts provided",
  "Host gave personal tour of the neighborhood",
];
const reviewText5 = [
  "Best place I've ever stayed at",
  "Fun-filled and action-packed",
  "I will come here again!",
  "Great accomodations, and very resonably priced",
  "I think I've found my favorite vacation spot",
  "Everything was superb! Highly recommended.",
];
const reviewTextArrays = [reviewText1, reviewText2, reviewText3, reviewText4, reviewText5];

/* return an array of 2 elements: a text description, and
 * a rating. (Rating may optionally be passed in to get
 * specific level of review text)
 */
function getReviewInfo(rating = getRandomInt(1,5)) {
  const commentaries = reviewTextArrays[rating-1];
  const commentary = commentaries[getRandomInt(0, commentaries.length-1)]
  return [commentary, rating];
}

const seederUserIds = async () => {
  let users = await User.findAll({
    attributes: ['id'],
    where: {username: seederUserNames}
  });
  return users.map(user => user.id)
}

const seederSpotIds = async () => {
  let spots = await Spot.findAll({
    attributes: ['id'],
    where: {ownerId: await seederUserIds()}
  });
  return spots.map(spot => spot.id);
}

const seederSpotImageIds = async () => {
  let images = await SpotImage.findAll({
    attributes: ['id'],
    where: {spotId: await seederSpotIds()}
  });
  return images.map(image => image.id);
}

const seederReviewIds = async () => {
  let reviews = await Review.findAll({
    attributes: ['id'],
    where: {userId: await seederUserIds()}
  });
  return reviews.map(review => review.id)
}

const seederBookingIds = async () => {
  let bookings = await Booking.findAll({
    attributes: ['id'],
    where: {userId: await seederUserIds()}
  });
  return bookings.map(booking => booking.id)
}

const seederReviewImageIds = async () => {
  let images = await ReviewImage.findAll({
    attributes: ['id'],
    where: {reviewId: await seederReviewIds()}
  });
  return images.map(image => image.id);
}

// Returns a random integer between min (inclusive) and
// max (inclusive). Neither max nor min have to be an int.
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const previewURLs = [


  "https://live.staticflickr.com/65535/53215558252_7d145ef3d7.jpg",
  "https://live.staticflickr.com/65535/53218309946_91eefa43ca_z.jpg",
  "https://live.staticflickr.com/65535/53219517230_a3d4edb8c2.jpg",
  "https://live.staticflickr.com/65535/53216589804_ba0a1686de.jpg",
  "https://live.staticflickr.com/65535/53218438651_c8ed53dcc2_m.jpg",
  "https://live.staticflickr.com/65535/53216245851_4f5b6e4cfd.jpg",
  "https://live.staticflickr.com/65535/53219667304_c87645c7a9_w.jpg",
  "https://live.staticflickr.com/65535/52936031382_f476c5a215.jpg",
  "https://live.staticflickr.com/65535/52462699498_8080076771.jpg",
  "https://live.staticflickr.com/3160/2450316867_5c0a17b457_n.jpg",
  "https://live.staticflickr.com/7147/6844429643_26403a8484_n.jpg",
  "https://live.staticflickr.com/677/19957157014_bd94958eb2_m.jpg",
  "https://live.staticflickr.com/2242/2044299449_2d258252ba_n.jpg",
  "https://live.staticflickr.com/29/63352203_a8c1931428_n.jpg",
  "https://live.staticflickr.com/6021/6017298800_539c6f5456_n.jpg",
  "https://live.staticflickr.com/7833/47532037102_3a3228062f_m.jpg",
  "https://live.staticflickr.com/4548/38445993762_9253c699fa_n.jpg",
  "https://live.staticflickr.com/54/111437982_f40d686084_m.jpg",
  "https://live.staticflickr.com/1944/43598579220_86ce460837_w.jpg",
  "https://live.staticflickr.com/3354/3611649363_cd404eb50b_w.jpg",
  "https://live.staticflickr.com/2851/11312469193_6e5c448978_m.jpg",
  "https://live.staticflickr.com/4154/5179470748_78f3ded5dc_m.jpg",
  "https://live.staticflickr.com/4510/23647937768_11b418fb58_w.jpg",
  "https://live.staticflickr.com/198/494249697_958efbca25_m.jpg",
  "https://live.staticflickr.com/6113/6294913251_6950c89137_m.jpg",
  "https://live.staticflickr.com/2066/2294880160_3c90ee0829_m.jpg",
  "https://live.staticflickr.com/3257/2608453963_5bc96a8c8f_m.jpg",
  "https://live.staticflickr.com/5238/14075094727_5946403feb_m.jpg",
  "https://live.staticflickr.com/4828/43992806420_b17657f617_w.jpg",
  "https://live.staticflickr.com/8438/29213933470_9bcdcb1653_n.jpg",
  "https://live.staticflickr.com/3184/2626961350_74d8ff3384_m.jpg",
  "https://live.staticflickr.com/4121/4798092426_aec400146a_n.jpg",
  "https://live.staticflickr.com/1913/30001872517_47dbcd15aa_w.jpg",
  "https://live.staticflickr.com/2379/2218038048_f5de587fb3_m.jpg",
  "https://live.staticflickr.com/2156/2114803034_d889e7d821_n.jpg",
  "https://live.staticflickr.com/3488/3713174207_70debe59ed_w.jpg",
  "https://live.staticflickr.com/7487/15894778812_ef2e0c4159_m.jpg",
  "https://live.staticflickr.com/44/132156771_88721438e3_n.jpg",
  "https://live.staticflickr.com/7268/7747947298_2beefb035c_m.jpg",

  ]

  const interiorURLs = [

    "https://live.staticflickr.com/2365/1571650156_7a2c72c361_n.jpg",
    "https://live.staticflickr.com/5569/14434385350_66a166f2c0_m.jpg",
    "https://live.staticflickr.com/3725/9479839375_0eabb95bdc_n.jpg",
    "https://live.staticflickr.com/3500/3849679753_b903c67bf9_n.jpg",
    "https://live.staticflickr.com/2939/14661292542_1803ec6122_n.jpg",
    "https://live.staticflickr.com/4005/4453749120_dcf85f808a_n.jpg",
    "https://live.staticflickr.com/3516/3995365385_006ae1d769_m.jpg",
    "https://live.staticflickr.com/5310/5753510968_c06ef3f579_n.jpg",
    "https://live.staticflickr.com/2524/3873254975_aacfd3de7e_m.jpg",
    "https://live.staticflickr.com/5061/5605051257_1d66ed92a2_n.jpg",
    "https://live.staticflickr.com/2561/3786999787_e8e320ccfb_n.jpg",
    "https://live.staticflickr.com/8021/7176946153_eb6d7391f6_n.jpg",
    "https://live.staticflickr.com/7329/9552610163_83a7e1d944_m.jpg",
    "https://live.staticflickr.com/8314/7924710454_43f59849eb_m.jpg",
    "https://live.staticflickr.com/5465/9478891516_13e85958bc_w.jpg",
    "https://live.staticflickr.com/4017/4407003878_b15f26c72d_n.jpg",
    "https://live.staticflickr.com/598/22849908077_d843e98974_m.jpg",
    "https://live.staticflickr.com/3020/2342671203_f18205d475_m.jpg",
    "https://live.staticflickr.com/2900/14661517005_bfa389329e_n.jpg",
    "https://live.staticflickr.com/8650/16654035286_ef6a6cd510_m.jpg",
    "https://live.staticflickr.com/7057/13446182633_8d9b79720d_n.jpg",
    "https://live.staticflickr.com/7425/9641577430_409ed3b0bb_n.jpg",
    "https://live.staticflickr.com/30/53547457_256cca01c6_m.jpg",
    "https://live.staticflickr.com/3522/5847113606_5ab84a402d_n.jpg",
    "https://live.staticflickr.com/7479/15268906264_03bc6cd736_n.jpg",
    "https://live.staticflickr.com/7506/15277902164_c6dcc6ee3b_n.jpg",
    "https://live.staticflickr.com/8085/8523279302_91e9266279_n.jpg",
    "https://live.staticflickr.com/220/1507345753_8a4ce6f4a1_n.jpg",
    "https://live.staticflickr.com/3548/5842406921_3280ffdbed_m.jpg",
    "https://live.staticflickr.com/65535/52303391523_5ec1606ddc_m.jpg",
    "https://live.staticflickr.com/2116/2240818840_99659c0528_n.jpg",
    "https://live.staticflickr.com/2950/15408125562_76e8c65f79_n.jpg",
    "https://live.staticflickr.com/1410/4601799410_d7ea7957ac_m.jpg",
    "https://live.staticflickr.com/4159/33881107983_d13179b1c6_n.jpg",
    "https://live.staticflickr.com/1218/928538627_90aa8afcc7_n.jpg",
    "https://live.staticflickr.com/4179/33848537094_c5f537dee5_w.jpg",
    "https://live.staticflickr.com/2907/33887527576_0c4478361e_m.jpg",
    "https://live.staticflickr.com/4271/34471232654_5f1f49cfb5_m.jpg",
    "https://live.staticflickr.com/4180/34690896435_4099465345_m.jpg",
    "https://live.staticflickr.com/4184/34529110492_1a5d1bbc74_w.jpg",
    "https://live.staticflickr.com/2856/33887530206_1883ca310c_w.jpg",
    "https://live.staticflickr.com/5586/14748895330_2417116abe_n.jpg",
    "https://live.staticflickr.com/6180/6182269464_57004860c2_m.jpg",
    "https://live.staticflickr.com/2941/15263516456_6a493b6190_w.jpg",
    "https://live.staticflickr.com/178/364854770_4d7ab1f388_w.jpg",
    "https://live.staticflickr.com/3291/5852819344_4721f6f374_m.jpg",
    "https://live.staticflickr.com/8602/16605239415_a3c407859f_n.jpg",

  ];

let ExternalVetting1 = null;

function getRandomPreviewImageUrl() {
    if (!ExternalVetting1 || !ExternalVetting1.length)
        ExternalVetting1 = [...previewURLs]
    const index = getRandomInt(0, ExternalVetting1.length-1);
    return ExternalVetting1.splice(index, 1)[0]
  }

let ExternalVetting2 = null;

function getRandomInteriorImageUrl() {
  if (!ExternalVetting2 || !ExternalVetting2.length)
    ExternalVetting2 = [...interiorURLs]
const index = getRandomInt(0, ExternalVetting2.length-1);
return ExternalVetting2.splice(index, 1)[0]
}
function getFullImages() {
  const urls = [];
  for (let i = 0; i < 4; i++)
    urls.push(getRandomInteriorImageUrl());
  return urls;
}

module.exports = { getRandomInt, getRandomInteriorImageUrl, getRandomPreviewImageUrl, getReviewInfo, seederBookingIds, seederReviewIds, seederReviewImageIds, seederSpotIds, seederSpotImageIds, seederUserIds, seederUserNames, getFullImages }
