let generateMessage = (from,text) => {
    return {
        from,
        text,
        createdAt: new Date().getTime()
    };
}
let generateLocationMessage = (from,lat,long) => {
    return {
        from,
        url: `http://www.google.com/maps?q=${lat},${long}`,
        createdAt: new Date().getTime()
    };
}

module.exports = {generateMessage, generateLocationMessage};