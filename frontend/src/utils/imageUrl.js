
// const URLS = [
//     "https://media.architecturaldigest.com/photos/64de4bcda5466fe1edbba6da/2:1/w_1280,c_limit/whale%20house.jpeg",

//     "https://www.thehousedesigners.com/images/uploads/SiteImage-Landing-house-plansluxury-1.webp",

//     "https://cdn.luxe.digital/media/20230126160156/biggest-houses-in-the-world-reviews-luxe-digital-1560x780.jpg.webp",

//     "https://www.sunset.com/wp-content/uploads/minecraft-house-exterior-0423-1200x600.jpg",

//     "https://www.vacationstravel.com/wp-content/uploads/2021/08/Untitled-design-26-1.jpg",

//     "https://media.architecturaldigest.com/photos/5ce2fed704c41e723f9a8839/16:9/w_1600,c_limit/214%20Bubble%20Palace.jpg",

//     "https://ychef.files.bbci.co.uk/1600x900/p053m19p.webp",

//     "https://upload.wikimedia.org/wikipedia/en/thumb/9/9c/Spadena_Witch_House.jpg/375px-Spadena_Witch_House.jpg",

//     "https://www.thespruce.com/thmb/n_wSbwtuxMC8iE0doiGsUVYgnhw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/a-frame-houses-4772019-hero-7cacd243cfe74fb8b06f44760ea59f35.jpg",

//     "https://tmhmedia.themodernhouse.com/uploads/DGLA9411_EsherHouse.jpg",

//     "https://spechtarchitects.com/wp-content/uploads/2017/01/Zero_zH_hero_grass_web.jpg",

//     "https://www.travelandleisure.com/thmb/aPoF8tuBTH6sMqvcwwGMqtcTNOw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/green-o-treehouse-montana_HERO_TREEHOUSE0822-219f8b36f0dd4421993eed3e8de274dc.jpg",

//     "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",

//     "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg",

// ]

export const placeholderSrc100 = "https://placehold.co/100?text=Photo+needed&font=montserrat"
export const placeholderSrc200 = "https://placehold.co/200?text=Photo+needed&font=montserrat"
// const placeholderSrc300 = "https://placehold.co/300?text=Photo+needed&font=montserrat"
// const placeholderSrc400 = "https://placehold.co/400?text=Photo+needed&font=montserrat"



export function getFullImages() {
    const result = []
    for (let i=0; i++ < 5;) result.push(placeholderSrc200)
    return result
}

// function getFullImages() {
//     let min = getRandomInt(0, URLS.length-6);
//     let max = min + 4;
//     const urls = URLS.slice(min, max+1);
//     console.log("🚀 ~ file: imageUrl.js:40 ~ getFullImages ~ min, max, urls:", min, max, urls)
//     return urls.map((u,i) => { return {"id": i, "url": u, "preview": (i === 0)}})
// }


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
