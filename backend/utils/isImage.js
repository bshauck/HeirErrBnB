
async function checkImage(url){

    const res = await fetch(url, {method:'HEAD'});
    const buff = await res.blob();
    return buff.type.startsWith('image/')
}

module.exports = {checkImage}
