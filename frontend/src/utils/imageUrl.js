
const previewURLs = [

"https://live.staticflickr.com/65535/47742834382_13a6d48515_w.jpg",
"https://live.staticflickr.com/460/18471339885_eea2365a8e_m.jpg",
"https://live.staticflickr.com/3469/3384339084_be3ffc410d_m.jpg",
"https://live.staticflickr.com/1083/532832223_2571019797_m.jpg",
"https://live.staticflickr.com/8236/8462057491_8391ce81f8_n.jpg",
"https://live.staticflickr.com/5081/5312115145_fb93185cff_m.jpg",
"https://live.staticflickr.com/4084/5188606619_10f976e39e_w.jpg",
"https://live.staticflickr.com/490/18743206263_ef51308d29_n.jpg",
"https://live.staticflickr.com/396/31859661355_e939e04391_n.jpg",
"https://live.staticflickr.com/56/179152787_255b507898_m.jpg",
"https://live.staticflickr.com/1738/42372284351_a25e5ff35c_n.jpg",
"https://live.staticflickr.com/1162/1421093738_480bc2d331_m.jpg",
"https://live.staticflickr.com/65535/53219517230_a3d4edb8c2.jpg",
"https://live.staticflickr.com/65535/53216245851_4f5b6e4cfd.jpg",
"https://live.staticflickr.com/65535/53219667304_c87645c7a9_w.jpg",
"https://live.staticflickr.com/65535/52936031382_f476c5a215.jpg",
"https://live.staticflickr.com/65535/52462699498_8080076771.jpg",
"https://live.staticflickr.com/3160/2450316867_5c0a17b457_n.jpg",
"https://live.staticflickr.com/7147/6844429643_26403a8484_n.jpg",
"https://live.staticflickr.com/677/19957157014_bd94958eb2_m.jpg",
"https://live.staticflickr.com/2242/2044299449_2d258252ba_n.jpg",
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

];

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

export const placeholderSrc100 = "https://placehold.co/100?text=Photo+needed&font=montserrat"
export const placeholderSrc200 = "https://placehold.co/200?text=Photo+needed&font=montserrat"
// const placeholderSrc300 = "https://placehold.co/300?text=Photo+needed&font=montserrat"
// const placeholderSrc400 = "https://placehold.co/400?text=Photo+needed&font=montserrat"


let ExternalVetting1 = null;

function getRandomPreviewImageUrl() {
    if (!ExternalVetting1 || !ExternalVetting1.length)
        ExternalVetting1 = [...previewURLs]
    const index = getRandomInt(0, ExternalVetting1.length-1);
    return ExternalVetting1.splice(index, 1)[0]
  }


export function getFullImages() {
    const urls = [getRandomPreviewImageUrl()];
    let min = getRandomInt(0, interiorURLs.length-1);
    let max = min + 3;
    if (max > interiorURLs.length-1) { max = min; min -= 3};
    while (min <= max) urls.push(interiorURLs[min++]);
    return urls;
}

// Returns a random integer between min (inclusive) and max (inclusive).
// Neither max nor min have to be an int.
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export const invalidImageURL = async url => {
  console.log("🚀 ~ invalidImageURL ~ url:", url)
  let result = {}
  const urlPattern = /^(https:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?\.(jpg|jpeg|png|webp)$/;
  const suspiciousCharactersPattern = /[<>'"()]/;

  if (!urlPattern.test(url)) result.url = "Your image URL must use HTTPS and be a known image type";
  if (suspiciousCharactersPattern.test(url)) result.characters = "Please choose a different URL";
  if (url.length > 200) result.length = "Path too long";

  console.log("🚀 ~ 1invalidImageURL ~ url:", url)
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
      const body = await response.headers();
      console.log("🚀 ~ invalidImageURL ~ body:", body)

      console.log("🚀 ~ 2invalidImageURL ~ response:", response)
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.startsWith('image/'))
      result.type = "Unknown image type"
      const contentLength = response.headers.get("Content-Length");
      if (contentLength) {
        if (contentLength > 2000000) result.size = "Image too large"
        else if (contentLength < 2000) result.size = "Image too small"
      } else result.size = "Image size indeterminate"
    } console.log("🚀 ~ 3invalidImageURL ~ response:", response)
  } catch(e) { result.fetch = "Problem retrieving image" }
  finally {
    if (!Object.keys(result).length) result = false
    console.log("🚀 ~ 4invalidImageURL ~ result:", result)
  }
  /* return false if valid-ish; otherwise, errors object */
  return result;
}





const seedLocationDescriptions = [

  "Tucked away in tranquility, this beautiful residence exudes warmth and hospitality. Each room is thoughtfully curated with comfortable furnishings and elegant decor, ensuring a peaceful and restorative stay. The spacious living areas invite relaxation and conversation, bathed in natural light and adorned with beautiful artwork. A well-equipped kitchen allows guests to craft meals with ease, promoting a home-away-from-home atmosphere. Lush gardens frame the property, creating serene outdoor spaces for leisure and enjoyment. The hosts’ attentive service and attention to detail further enhance the experience, promising a stay marked by comfort and care.",

  "This striking modern house offers a blend of style and comfort. Its open-concept design promotes a sense of space and freedom, with floor-to-ceiling windows that unveil delightful panoramic views. Each bedroom is a haven of coziness with plush bedding and soothing decor. A state-of-the-art kitchen meets all culinary needs, making meal preparation a delightful experience. Outdoor spaces are just as captivating, featuring a lovely patio and garden where one can soak in the surrounding beauty. The house reverberates with a warm ambiance, making guests feel immediately at home.",

  "Embrace the charm of this delightful cottage that seamlessly blends rustic allure with modern amenities. The interior spaces are a canvas of cozy textiles, inviting furnishings, and a fireplace that adds a touch of warmth. Bedrooms offer a serene retreat, ensuring restful sleep and sweet dreams. A fully stocked kitchen makes at-home dining a breeze, adding to the convenience of the stay. Picturesque landscapes envelop the cottage, offering scenic views and spaces for outdoor relaxation and exploration. Every detail in this home is meticulously cared for, promising a delightful and memorable stay.",

  "Luxury finds its definition in this splendid residence, where every detail is a testament to style and comfort. Expansive living spaces dazzle with modern decor and innovative design elements, ensuring that every moment indoors is a pleasure. Bedrooms are meticulously appointed, offering a harmonious blend of elegance and relaxation. A gourmet kitchen stands ready to cater to all culinary desires, equipped with top-of-the-line appliances. Outdoor areas are just as magnificent, featuring a stunning pool and landscaped gardens that invite leisurely moments under the sky. An ambiance of sophistication pervades this home, guaranteeing an extraordinary stay.",

  "Discover a sanctuary of peace in this exquisite villa that resonates with elegance and luxury. Voluminous rooms adorned with tasteful decor create a backdrop for relaxation and tranquility. The bedrooms are sanctuaries of comfort, outfitted with plush linens and soothing colors. A chef’s kitchen provides everything necessary for culinary creativity, while spacious living areas promote togetherness and entertainment. The exterior boasts a stunning pool and beautifully manicured gardens, allowing guests to bask in natural beauty. This villa is a haven where every moment is steeped in luxury and comfort.",

  "In this delightful home, traditional charm meets modern elegance. Spacious rooms with high ceilings and beautiful finishes offer a fresh, airy feel, while tasteful decor adds to the overall ambiance of warmth. Comfortable bedrooms ensure a restful night’s sleep, complemented by luxurious bathrooms that add a touch of spa-like indulgence. The kitchen is a dream, fully equipped with everything needed for delightful home-cooked meals. A beautifully maintained garden offers a peaceful retreat for relaxation and outdoor enjoyment. The hospitality encountered here ensures a stay that feels both pampered and genuinely homely.",

  "This architecturally stunning home welcomes guests into a space where contemporary design harmonizes with comfort. Large windows flood the interiors with natural light, enhancing the beauty of the decor and furnishings. Each bedroom is crafted for relaxation and rest, ensuring that guests wake up refreshed and rejuvenated. A modern, well-equipped kitchen allows for the effortless preparation of meals and entertaining. Outdoor spaces, including a charming patio and garden, promise moments of peace and connection with nature. The residence’s thoughtful design and attentive service create a stay that is both luxurious and heartwarming.",

  "Nestled amidst nature's embrace, this lovely home offers a refuge of tranquility and comfort. The interior spaces are warm and welcoming, with decor and furnishings that echo the beauty of the surroundings. Bedrooms are intimate retreats, promising nights of restful sleep and sweet dreams. A fully functional kitchen adds to the convenience, allowing guests to embrace the joy of cooking. The outdoor areas are enchanting, with patios and gardens that invite moments of relaxation and contemplation. This home is a sanctuary where every detail is woven with care and warmth.",

  "Experience the luxury of space and style in this magnificent house, where elegance permeates every corner. The living areas are expansive and beautifully decorated, creating spaces where memories are made. Bedrooms epitomize comfort, offering lush bedding and serene decor for restful nights. The kitchen is a masterpiece of functionality and modernity, ready to facilitate delightful culinary experiences. Outdoor spaces are captivating with lush landscapes and comfortable seating areas, ideal for soaking in the beauty of the surroundings. This house emanates a sense of refined luxury, promising a stay that is unforgettable.",

  "In the heart of serenity, this charming home beckons guests with warmth and hospitality. Cozy interiors, filled with thoughtful touches, create an atmosphere that feels like a home away from home. Comfortable bedrooms, adorned with soft linens and delightful decor, promise peaceful slumbers. The kitchen is fully equipped, making meal preparation easy and enjoyable. Outdoor spaces are a breath of fresh air, offering lush gardens and comfortable seating for moments of relaxation. Every aspect of this home has been curated with care, ensuring a stay that is filled with comfort and pleasant memories.",

  "This enchanting home is a portal to a realm of unmatched comfort and elegance. Majestic living spaces are adorned with sophisticated decor and plush furnishings, crafting an atmosphere of luxurious warmth. Bedrooms radiate tranquility, featuring heavenly bedding and serene ambiance for a divine rest. A meticulously equipped kitchen stands ready to inspire culinary adventures, adding a delightful touch of home. Magnificent gardens and outdoor areas unfold in a canvas of nature's artwork, offering sublime spots for relaxation and leisure. In this residence, every detail harmonizes to create a symphony of exquisite living.",

  "Unveiling an oasis of modern charm, this house mesmerizes with its blend of innovative design and cozy atmosphere. Vibrant living spaces invite relaxation, adorned with contemporary furnishings and infused with natural light. Bedrooms embody the essence of comfort, ensuring restorative nights amidst soft linens and soothing colors. Culinary enthusiasts will adore the state-of-the-art kitchen, promising delightful cooking experiences. Outside, a beautifully curated garden provides a sanctuary for the senses, allowing moments of peace and connection with nature. The thoughtful arrangement and modern amenities make this home a remarkable stay.",

  "Step into a world where historical charm and modern elegance converge, in this beautifully restored residence. With rooms that echo tales of the past elegantly woven with contemporary comforts, the experience is uniquely delightful. Cozy bedrooms, filled with natural light and plush bedding, offer a peaceful retreat from the world. A fully stocked kitchen invites the joy of home-cooked meals, enhancing the feel of a home away from home. The exterior boasts lovingly maintained gardens, where guests can wander or relax in serene surroundings. Exceptional service and thoughtful touches contribute to making the stay an unforgettable experience.",

  "Experience the allure of this chic urban dwelling, where sleek design meets comfortable living. Each room is a canvas of modern aesthetics, infused with a sense of warmth and relaxation. Inviting bedrooms ensure a restful sleep, complemented by luxurious amenities that enhance the experience. The kitchen, modern and well-equipped, stands ready to meet all culinary desires, ensuring convenience throughout the stay. A private terrace or balcony adds a touch of outdoor elegance, allowing guests to bask in the beauty of the skies. This home curates a seamless blend of style, comfort, and impeccable service.",

  "Immerse yourself in the timeless elegance of this stunning residence, where traditional beauty meets contemporary luxury. Spacious rooms adorned with refined decor create an ambiance of sophistication and warmth. Bedrooms are sanctuaries of peace, providing plush bedding and tranquil surroundings for a restorative rest. The exquisite kitchen facilitates delightful dining experiences, enhancing the feeling of luxury. Beautifully landscaped gardens offer spaces for leisure and relaxation, adding to the charm of the environment. In this residence, every detail is carefully curated to ensure an extraordinary and memorable stay.",

  "This eco-friendly abode invites guests into a realm of harmony, comfort, and sustainable living. The interior is a celebration of natural materials and elegant simplicity, creating spaces that breathe life and tranquility. Bedrooms are thoughtfully designed to promote rest and rejuvenation, ensuring each morning is welcomed with renewed energy. A well-appointed kitchen allows for the creation of nourishing meals, adding to the wholesome atmosphere of the home. Outdoor spaces resonate with the beauty of nature, encouraging moments of reflection and connection. This home is a testament to the beauty of eco-conscious living, promising a stay that nurtures the spirit.",

  "Delight in the spacious elegance of this home, where luxury unfolds in every room. Expansive living areas are adorned with stylish furnishings and decor, setting the stage for memorable moments. Bedrooms exude comfort and tranquility, ensuring nights are bathed in restful slumber. A gourmet kitchen opens the doors to culinary exploration, equipped with everything necessary for delightful meals. Outdoor spaces shine with beautifully maintained gardens and patios, inviting guests to indulge in the fresh air. This home’s extraordinary attention to detail promises a stay of unmatched comfort and luxury.",

  "This vibrant residence sings a song of style and comfort, welcoming guests into a space where every detail sparkles with care. Inviting living spaces are dressed in cheerful colors and cozy furnishings, crafting an ambiance of warmth and joy. Bedrooms are havens of relaxation, adorned with comfy bedding and thoughtful touches that ensure a restful night. The kitchen is a heartwarming space, fully equipped to make meal preparation a joyful experience. A lovely garden enhances the outdoor area, providing a delightful space to unwind and enjoy nature’s beauty. This delightful home creates an environment where happiness and comfort flourish.",

  "Nestled in the embrace of serene landscapes, this residence stands as a sanctuary of peace and beauty. Rooms flow gracefully, adorned with decor that echoes the tranquility of nature, creating harmonious living spaces. The bedrooms are meticulously designed to promote rest, ensuring that each night is a journey of rejuvenation. A beautifully appointed kitchen enhances the living experience, offering a space for culinary creativity. The outdoors unfolds in a symphony of nature’s magnificence, with gardens and patios that invite relaxation. Every aspect of this home is infused with a sense of peace and thoughtful care, ensuring a memorable stay.",

  "Nestled in the embrace of serene landscapes, this residence stands as a sanctuary of peace and beauty. Rooms flow gracefully, adorned with decor that echoes the tranquility of nature, creating harmonious living spaces. The bedrooms are meticulously designed to promote rest, ensuring that each night is a journey of rejuvenation. A beautifully appointed kitchen enhances the living experience, offering a space for culinary creativity. The outdoors unfolds in a symphony of nature’s magnificence, with gardens and patios that invite relaxation. Every aspect of this home is infused with a sense of peace and thoughtful care, ensuring a memorable stay.",

  "Welcome to a home where minimalist elegance and utmost comfort collide. Each room is a canvas painted with subtle colors and sleek furnishings that evoke a sense of tranquility. Bedrooms are meticulously designed for rest, each nestling guests in a cocoon of soft linens and serene ambiance. The kitchen is a masterpiece of functionality, equipped with modern appliances for delightful culinary ventures. An inviting patio or garden space adds a breath of fresh air, allowing guests to soak in the tranquility of the outdoors. Every element in this home harmonizes to offer a seamless and rejuvenating living experience.",

  "Step into a realm where every corner whispers tales of elegance and every room exudes a warm embrace. Spacious living areas unfurl with luxurious furnishings and captivating decor that promises comfort in style. The bedrooms offer a harmonious retreat with plush bedding and soothing tones ensuring a heavenly rest. In the kitchen, modern amenities and thoughtful design make for delightful culinary explorations. A blossoming garden awaits outside, offering enchanting spaces to revel in nature’s beauty and find moments of peace. This home orchestrates a symphony of exquisite details, crafting a memorable and delightful stay.",

  "Discover the epitome of modern luxury in this magnificent dwelling, where cutting-edge design meets heartwarming comfort. Expansive living spaces glow with natural light, adorned with chic decor and state-of-the-art amenities. Each bedroom is a sanctuary, furnished with utmost care to promote relaxation and restful slumber. Culinary passions can take flight in the sleek, fully equipped kitchen that stands ready to inspire. Outdoor spaces shimmer with beauty and charm, creating delightful havens for leisure and relaxation. In this exceptional home, a radiant atmosphere and impeccable design cultivate an unforgettable living experience.",

  "Immerse yourself in the embrace of this charming residence, where homely warmth and elegant comforts meld seamlessly. Rooms bloom with thoughtful touches and inviting decor, enhancing the ambiance of tranquility. Comfort flows through the bedrooms, each nestling guests in a realm of soft fabrics and serene hues. A well-appointed kitchen radiates warmth, offering a lovely space for culinary creativity. Outside, delightful gardens or patios usher in a symphony of nature’s charm and serene vibes. This wonderful home unfolds in a cascade of delightful details, each crafted to enrich the staying experience.",

  "In this captivating abode, every space is a delightful voyage of comfort and style. Vibrant living spaces are adorned with elegant furnishings, blossoming with an aura of warmth and hospitality. Bedrooms resonate with peace, each designed to provide a nurturing atmosphere for rest and rejuvenation. The kitchen, brimming with modern conveniences, stands as a realm where culinary dreams flourish. The outdoors is a canvas of natural beauty, offering enchanting spaces for rest and contemplation. This delightful residence crafts an ambiance where each moment is cherished and every stay is memorable.",

  "Experience the grandeur of this opulent residence, where luxury unfolds in a symphony of exquisite details. Majestic living areas dazzle with a blend of classic elegance and contemporary flair, ensuring every moment indoors is splendid. Bedrooms emerge as sanctuaries of tranquility, each designed to lavish guests with comfort and restful sleep. A gourmet kitchen awaits, fully equipped to meet every culinary desire with grace and ease. Outside, lavish gardens or patios offer magnificent spaces to revel in the beauty of the surroundings. In this house, elegance and luxury are woven into the fabric of every experience, creating a truly remarkable stay.",

  "Bask in the delightful ambiance of this residence, where coziness and thoughtful design harmonize. Living areas flourish with comfortable furnishings and delightful decor, creating spaces that breathe warmth and happiness. The bedrooms, each a cocoon of comfort, are adorned with plush bedding and soft hues, ensuring restful nights. A charming kitchen, rich with amenities, makes at-home dining a joyous experience. Inviting outdoor spaces, whether gardens or patios, unfold as realms of relaxation and natural beauty. In this welcoming home, every detail is a brush stroke that paints a stay of comfort and joy.",

  "Step into a haven where contemporary elegance flows through stylish rooms and luxurious amenities. Living spaces are a canvas of chic decor and modern furnishings, emanating an aura of sophistication. Bedrooms offer a serene retreat, where restful nights are cradled in soft linens and comforting hues. A state-of-the-art kitchen enhances the experience, equipped to delight the culinary enthusiast. Beautiful outdoor spaces extend the living areas, offering tranquil spots to enjoy nature’s beauty. This remarkable residence curates a delightful atmosphere where style and comfort reign supreme.",

  "Welcome to an enchanting abode where each room is a melody of elegance and comfort. Spacious living areas resound with warmth, adorned with delightful furnishings and beautiful decor. Bedrooms offer harmonious retreats, each space thoughtfully designed to ensure rest and tranquility. A well-appointed kitchen sings with modern amenities, ready to inspire delightful culinary compositions. The outdoor spaces echo with the beauty of nature, providing idyllic spaces for relaxation and leisure. This delightful residence orchestrates a symphony of wonderful experiences, making every stay a memorable one.",

  "Experience the charm of this splendid home, where traditional elegance meets modern luxury. Spacious rooms unfold with a blend of classic decor and contemporary amenities, offering delightful living spaces. Each bedroom is a realm of comfort, adorned with soft fabrics and restful tones to ensure peaceful slumbers. The kitchen is a warm heart of the home, equipped to facilitate delightful dining experiences. Beautiful gardens or patios enhance the residence, creating lovely spaces to enjoy the outdoors. In this exquisite home, a harmonious atmosphere and thoughtful details craft a stay of unmatched comfort and elegance."

];

let ExternalVetting3 = null;

export function getRandomLocationDescription() {
  if (!ExternalVetting3 || !ExternalVetting3.length)
      ExternalVetting3 = [...seedLocationDescriptions]
  const index = getRandomInt(0, ExternalVetting3.length-1);
  return ExternalVetting3.splice(index, 1)[0]
}
