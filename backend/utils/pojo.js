
function adjustPojo(pojo, array, result={}) {
    // Take existing attributes one at a time from array, and
    // grab the value, delete the key, and reinsert it at end
    // with original value. Well, after the delete and resinsert
    // it goes back to the oiginal slot so put
    // it in a new POJO
    array.forEach(key=>{
        let tmp = pojo[key];
        if (tmp === undefined) tmp = null;
        result[key] = tmp;
    });
    return result;
};

module.exports = { adjustPojo }
