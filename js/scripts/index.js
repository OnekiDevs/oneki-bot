//imports
require('dotenv').config();
const { Client, Collection } = require('discord.js');
const fs = require('fs');
const admin = require('firebase-admin');
global.fetch = require('node-fetch')


//declarations
global.client = new Client({
    intents: [
        'DIRECT_MESSAGES',
        'GUILD_MESSAGES',
        'GUILDS',
        'GUILD_WEBHOOKS',
        'GUILD_BANS',
        'GUILD_MESSAGE_REACTIONS'
    ],
    partials: [
        'CHANNEL'
    ]
});
client.commands = new Collection();
global.util = require('./util');
client.buttons = new Collection();
client.servers = new Collection();
client.slash = new Collection();
client.uno = new Collection();
// const serviceAccount = require("../../src/firebase-key.json");
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.TOKEN_FIREBASE))
});
global.db = admin.firestore();

// db.collection('850338969135611924').doc('fantasmita').get().then(async s=>{
//     const ids = Object.keys(s.data())
//     const puntuajes = []
//     for (const id of ids) {
//         const obj = {}
//         obj[id] = s.data()[id]
//         puntuajes.push(obj)
//     }
//     console.log(puntuajes)
//     // puntuajes.forEach(a=>console.log(a[Object.keys(a)[0]]))
//     puntuajes.sort((a,b) => a[Object.keys(a)[0]] - b[Object.keys(b)[0]]).reverse()
//     console.log(puntuajes)
// })
//
// return;

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
    client.on(event.name, event.run.bind());
    console.log("\x1b[33m%s\x1b[0m", file, "fue cargado correctamente");
}

//load commands
// for (const file of fs.readdirSync("./js/commands").filter((f) => f.endsWith(".js"))) {
//     const command = require("../commands/" + file);
//     client.commands.set(command.name, command);
//     console.log("\x1b[36m%s\x1b[0m", file, "fue cargado correctamente");
// }
for(const file of fs.readdirSync('./js/commands').filter(f=>f.endsWith('.js'))) {
    const Command = new (require(`../commands/${file}`))
    client.commands.set(Command.name, Command);
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
client.login(process.env.NODE_ENV!=='production'?process.env.TOKEN_DISCORD_DEV:process.env.TOKEN_DISCORD);

const WebSocket = require('ws');
global.ws = new WebSocket('wss://oneki.herokuapp.com/');

ws.on('open', function open() {
    console.log('socket conectado')
    // ws.send(JSON.stringify({
    //     event: 'xd',
    //     server: '584215654565661563',
    //     data: {
    //         in: ['f']
    //     }
    // }))
});

ws.on('message', function incoming(message) {
    console.log('ws received: %s', message);
});
