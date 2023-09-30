
const previewURLs = [

"https://live.staticflickr.com/65535/53215558252_7d145ef3d7.jpg",
"https://live.staticflickr.com/65535/53217555015_b9c0f8418a.jpg",
"https://live.staticflickr.com/65535/53218309946_91eefa43ca_z.jpg",
"https://live.staticflickr.com/65535/53219517230_a3d4edb8c2.jpg",
"https://live.staticflickr.com/65535/53217167864_3a866d3562_n.jpg",
"https://live.staticflickr.com/65535/53216589804_ba0a1686de.jpg",
"https://live.staticflickr.com/65535/53218438651_c8ed53dcc2_m.jpg",
"https://live.staticflickr.com/65535/53216245851_4f5b6e4cfd.jpg",
"https://live.staticflickr.com/65535/53219667304_c87645c7a9_w.jpg",
"https://live.staticflickr.com/65535/52936031382_f476c5a215.jpg",
"https://live.staticflickr.com/65535/52462699498_8080076771.jpg",
"https://live.staticflickr.com/7833/47532037102_3a3228062f_m.jpg",
"https://live.staticflickr.com/4548/38445993762_9253c699fa_n.jpg",

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

];

export const placeholderSrc100 = "https://placehold.co/100?text=Photo+needed&font=montserrat"
export const placeholderSrc200 = "https://placehold.co/200?text=Photo+needed&font=montserrat"
// const placeholderSrc300 = "https://placehold.co/300?text=Photo+needed&font=montserrat"
// const placeholderSrc400 = "https://placehold.co/400?text=Photo+needed&font=montserrat"



// export function getFullImages() {
//     const result = []
//     for (let i=0; i++ < 5;) result.push(placeholderSrc200)
//     return result
// }

export function getFullImages() {
    const urls = [previewURLs[getRandomInt(0, previewURLs.length-1)]];
    let min = getRandomInt(0, interiorURLs.length-1);
    let max = min + 3;
    if (max > interiorURLs.length-1) { max = min; min -= 3};
    while (min <= max) urls.push(interiorURLs[min++]);
    return urls;
}


// function getURLSIndex() {
//     return getRandomInt(0, URLS.length=1)
// }

// function getImageUrl() {
//     return URLS[getURLSIndex()]
// }

// Returns a random integer between min (inclusive) and max (inclusive).
// Neither max nor min have to be an int.
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
