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

const post = async (dev) => {
    const client = new interactions.Client(dev?process.env.TOKEN_DISCORD_DEV:process.env.TOKEN_DISCORD, dev?process.env.BOT_ID_DEV:process.env.BOT_ID);
    let slashDir = fs.readdirSync("./js/slash").filter((f) => f.endsWith(".js"));
    for (let file of slashDir) {
        let slash = require('../slash/'+file);
        client.createCommand(slash.data)
            .then((response) => {
                console.log(response.name + " created");
            })
            .catch((error) => {
                console.error("Error", error);
                const date = new Date();
                fs.writeFile(`Error-Post-Slash-${date.getTime}.json`, error, (err) => {
                    if (err) console.error("Log Error", err);
                    else console.log('Slash Error || Complet log in',`Error-Post-Slash-${date.getTime}.json`)
                })
            });
        await sleep(1000);
    }
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
        post(dev)
    } catch (error) {
        console.log(error);
    }

}

if (module === require.main) {
    main();
}