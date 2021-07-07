const { MessageButton } = require('discord.js');
module.exports = (client, interact) => {
    // console.log(interact);
    // console.log(interact.customID);
    const gameloop = require("./gameloop.js").get();
    let playerCards2;
    let playerCards3;
    let playerCards4;
    console.table(gameloop.playerCards);
    console.log(gameloop.playerCards.length);
    if (gameloop.playerCards.length > 5) {
        playerCards2 = gameloop.playerCards.slice(5 - gameloop.playerCards.length);
        console.table(playerCards2); 
    }
    
    gameloop.playerCards.length = 5;
    console.table(gameloop.playerCards);
    let components = [];
    let components2 = [];
    gameloop.playerCards.forEach(card => {
        components.push(new MessageButton().setLabel(card).setStyle('PRIMARY').setCustomID(`uno_card_${card}`))
    });
    if(playerCards2) {
        playerCards2.forEach(card => {
            components2.push(new MessageButton().setLabel(card).setStyle('PRIMARY').setCustomID(`uno_card_${card}`))
        })
    }
    if (components2) {
        interact.reply({
            content: "Cartas:", 
            ephemeral: true, 
            components: [components, components2]
        });
    } else {
        interact.reply({
            content: "Cartas:", 
            ephemeral: true, 
            components: [components]
        });
    }
    if (playerCards2) {
        playerCards2.forEach(element => {
            gameloop.playerCards.push(element);
        });
    }
}