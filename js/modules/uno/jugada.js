module.exports = (client, interact) => {
    console.log(interact.customID);
    const gameloop = require("./gameloop.js").get();
    console.table(gameloop);
}