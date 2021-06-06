require("dotenv").config();
const interactions = require("discord-slash-commands-client");
const fs = require("fs");
const { sleep } = require('../modules/util');


// const admin = require("firebase-admin");
// const serviceAccount = require("../../firebase.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://kone-bot-default-rtdb.firebaseio.com/",
// });

const deleteAll = async (dev) => {
    const client = new interactions.Client(dev?process.env.TOKEN_DISCORD_DEV:process.env.TOKEN_DISCORD, dev?process.env.BOT_ID_DEV:process.env.BOT_ID);
    client.getCommands().then(async (commands) => {
        for (const command of commands) {
            client.deleteCommand(command.id).then(console.log(command.name)).catch(console.error);
            await require('../modules/util').sleep(1000);
        }
    }).catch(console.error);
}

const main = () => {

    //revisamos que tenga los parametros nesesarios
    if (process.argv.length !== 3) {
        console.error(`Usage: node ${__filename} [dev | production]`);
        process.exit(1);
    }
    //obtenemos el nesesario
    let [, , dev] = process.argv;
    //revisamos si es lo que requiere
    if (dev == 'dev') {
        dev = true
    } else if (dev == 'production') {
        dev = false
    }else {
        console.error(`Usage: node ${__filename} [dev | production]`);
        process.exit(1);
    }
    //ejecutamos el bot
    try {
        deleteAll(dev)
    } catch (error) {
        console.log(error);
    }

}

if (module === require.main) {
    main();
}