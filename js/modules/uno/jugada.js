const { MessageButton } = require('discord.js');
const utiles = require('../util.js')
let colors = ["red", "blue", "yellow", "green"];
module.exports = (client, interact) => {

    // console.log(interact);
    // console.log(interact.customID);
    const gameloop = require("./gameloop.js").get();
    console.log(interact.user.id)
    if (!gameloop.partidaLocal.jugadores.includes(interact.user.id)) {
        return interact.reply({ content: "No estas dentro de la partida!", ephemeral: true })
    }
    let playerCards2;
    let playerCards3;
    let playerCards4;
    let playerCards5;
    // console.table(gameloop.playerCards);
    // console.log(gameloop.playerCards.length);
    if (gameloop.playerCards.length > 5) {
        playerCards2 = gameloop.playerCards.slice(5 - gameloop.playerCards.length);
        // console.table(playerCards2);
        gameloop.playerCards.length = 5;
    }


    // console.table(gameloop.playerCards);
    let components = [];
    let components2 = [];
    let components3 = [];
    let components4 = [];
    let components5 = [];
    console.table(gameloop)
    gameloop.playerCards.forEach(card => {
        let cardLabel;
        if (/b/g.test(card) === true) cardLabel = card.replace("b", " 🟦");
        else if (/r/g.test(card) === true) cardLabel = card.replace("r", " 🟥");
        else if (/g/g.test(card) === true) cardLabel = card.replace("g", " 🟩");
        else if (/y/g.test(card) === true) cardLabel = card.replace("y", " 🟨");
        components.push(new MessageButton().setLabel(cardLabel).setStyle('PRIMARY').setCustomID(`uno_card_${card}`))
    });



    if (playerCards2 && playerCards2.length > 5) {
        playerCards3 = playerCards2.slice(5 - playerCards2.length);
        // console.table(playerCards2);


    }
    if (playerCards3 && playerCards3.length > 5) {
        playerCards4 = playerCards3.slice(5 - playerCards3.length);

        playerCards3.length = 5;

    }

    if (playerCards4 && playerCards4.length > 5) {
        playerCards5 = playerCards4.slice(5 - playerCards4.length);
        playerCards4.length = 5;
    }

    if (playerCards4) {
        playerCards4.forEach(card => {
            let cardLabel;
            if (/b/g.test(card) === true) cardLabel = card.replace("b", " 🟦");
            else if (/r/g.test(card) === true) cardLabel = card.replace("r", " 🟥");
            else if (/g/g.test(card) === true) cardLabel = card.replace("g", " 🟩");
            else if (/y/g.test(card) === true) cardLabel = card.replace("y", " 🟨");
            components4.push(new MessageButton().setLabel(cardLabel).setStyle('PRIMARY').setCustomID(`uno_card_${card}`))
        })
    }

    if (playerCards3) {
        playerCards3.forEach(card => {
            let cardLabel;
            if (/b/g.test(card) === true) cardLabel = card.replace("b", " 🟦");
            else if (/r/g.test(card) === true) cardLabel = card.replace("r", " 🟥");
            else if (/g/g.test(card) === true) cardLabel = card.replace("g", " 🟩");
            else if (/y/g.test(card) === true) cardLabel = card.replace("y", " 🟨");
            components3.push(new MessageButton().setLabel(cardLabel).setStyle('PRIMARY').setCustomID(`uno_card_${card}`))
        })
    }

    if (playerCards5) {
        playerCards5.forEach(card => {
            let cardLabel;
            if (/b/g.test(card) === true) cardLabel = card.replace("b", " 🟦");
            else if (/r/g.test(card) === true) cardLabel = card.replace("r", " 🟥");
            else if (/g/g.test(card) === true) cardLabel = card.replace("g", " 🟩");
            else if (/y/g.test(card) === true) cardLabel = card.replace("y", " 🟨");
            components5.push(new MessageButton().setLabel(cardLabel).setStyle('PRIMARY').setCustomID(`uno_card_${card}`))
        })
    }

    playerCards2.length = 5;
    if (playerCards2) {
        playerCards2.forEach(card => {
            let cardLabel;
            if (/b/g.test(card) === true) cardLabel = card.replace("b", " 🟦");
            else if (/r/g.test(card) === true) cardLabel = card.replace("r", " 🟥");
            else if (/g/g.test(card) === true) cardLabel = card.replace("g", " 🟩");
            else if (/y/g.test(card) === true) cardLabel = card.replace("y", " 🟨");
            components2.push(new MessageButton().setLabel(cardLabel).setStyle('PRIMARY').setCustomID(`uno_card_${card}`))
        })
    }

    console.table(components2)
    console.table(components3)
    console.table(components4)
    if (components2 && !playerCards3) {
        interact.reply({
            content: `Cartas:`,
            ephemeral: true,
            components: [components, components2]
        });
    }
    if (playerCards3 && !playerCards4) {
        interact.reply({
            content: "Cartas:",
            ephemeral: true,
            components: [components, components2, components3]
        });
    }
    if (playerCards3 && playerCards4 && !playerCards5) {
        interact.reply({
            content: "Cartas:",
            ephemeral: true,
            components: [components, components2, components3, components4]
        });
    }

    if (playerCards4 && playerCards5) {
        interact.reply({
            content: "Cartas:",
            ephemeral: true,
            components: [components, components2, components3, components4, components5]
        });
    }
    if (components && !playerCards3 && !playerCards2 && !playerCards4 && !playerCards5) {
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
    if (playerCards3) {
        playerCards3.forEach(element => {
            gameloop.playerCards.push(element);
        });
    }
    if (playerCards4) {
        playerCards4.forEach(element => {
            gameloop.playerCards.push(element);
        });
    }
    if (playerCards5) {
        playerCards5.forEach(element => {
            gameloop.playerCards.push(element);
        });
    }
}