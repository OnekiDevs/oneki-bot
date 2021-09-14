const sleep = (ms=1000) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    sleep,
    lang: require('./langs'), 
    replace: require('./replace'),
    errorEmbed: require('./errorEmbed')
}