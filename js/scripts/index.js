//imports
require('dotenv').config();
const { Client, Collection } = require('discord.js');
const fs = require('fs');
const admin = require('firebase-admin');   

// return;

//declarations
const client = new Client({
    intents: [
        'DIRECT_MESSAGES',
        'GUILD_MESSAGES',
        'GUILDS',
        'GUILD_WEBHOOKS',
        'GUILD_BANS'
    ],
    partials: [
        'CHANNEL'
    ]
});
client.commands = new Collection();
client.util = require('./util');
client.buttons = new Collection();
client.servers = new Collection();
client.slash = new Collection();
client.uno = new Collection();
// const serviceAccount = require("../../src/firebase-key.json");
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.TOKEN_FIREBASE))
});
const db = admin.firestore();

// //load config
// db.collection(`config`).doc('bot').onSnapshot(doc => {
//     client.settings = {
//         prefix: doc.data()?.prefix??'r!',
//         dmChannel: "832788680200028212",
//         guild: "825936007449935903"
//     }
// })

//load events
for (const file of fs.readdirSync("./js/events").filter((f) => f.endsWith(".js"))) {
    const event = require(`../events/${file}`);
    client.on(event.name, event.run.bind(null, client));
    console.log("\x1b[33m%s\x1b[0m", file, "fue cargado correctamente");
}

//load commands
for (const file of fs.readdirSync("./js/commands").filter((f) => f.endsWith(".js"))) {
    const command = require("../commands/" + file);
    client.commands.set(command.name, command);
    console.log("\x1b[36m%s\x1b[0m", file, "fue cargado correctamente");
}

//load slash
for (const file of fs.readdirSync("./js/slash").filter((f) => f.endsWith(".js"))) {
    const slash = require("../slash/" + file);
    client.slash.set(slash.name, slash);
    console.log("\x1b[32m%s\x1b[0m", file, "fue cargado correctamente");
}

//load buttons
for (const file of fs.readdirSync("./js/buttons").filter((f) => f.endsWith(".js"))) {
    const button = require("../buttons/" + file);
    client.buttons.set(button.id, button);
    console.log("\x1b[35m%s\x1b[0m", file, "fue cargado correctamente");
}

//login
client.login(process.env.NODE_ENV!='production'?process.env.TOKEN_DISCORD_DEV:process.env.TOKEN_DISCORD);

//play ground
if (process.env.NODE_ENV == 'development') client.on('ready', message => {
//     console.log(process.env.stateBot)
//     process.env.stateBot = "sd"
//     console.log(process.env.stateBot)
//     client.channels.cache.get('860715234574729216')?.send('<a:kannasip:857080764461482026>')
})