const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    sleep,
    joinVoice: require('./joinVoice'),
    lang: require('./langs'), 
    replace: require('./replace')
}