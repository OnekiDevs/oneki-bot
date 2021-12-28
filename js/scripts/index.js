//imports
// classes = require('../classes/exportClasses')
require('dotenv').config();
const { Client, Collection } = require('discord.js');
const fs = require('fs');
const admin = require('firebase-admin');
fetch = require('node-fetch')
sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))
//declarations
client = new Client({
    intents: [
        'DIRECT_MESSAGES',
        'GUILD_MESSAGES',
        'GUILDS',
        'GUILD_WEBHOOKS',
        'GUILD_BANS',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_VOICE_STATES'
    ],
    partials: [
        'CHANNEL'
    ]
});
global.util = require('./util');
client.commands = new Collection();
client.buttons = new Collection();
client.servers = new Collection();
client.voice.servers = new Collection();
client.slash = new Collection();
client.userCommands = new Collection();
client.uno = new Collection();
client.constants = {
    emojis: {
        yes: '<:yes:885693508533489694>',
        no: '<:no:885693492632879104>'
    },
    developers: [
        '534614025271771158',
        '617154779755446280',
        '431256203990138881'
    ],
    channels: {
        imgs: '885674115946643456',
        errors: '885674115615301651',
        issues: '885674115615301646'
    },
    rolls: {
        js: '885674114663211038'
    }
}
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.TOKEN_FIREBASE))
});
db = admin.firestore();


//load events
for (const file of fs.readdirSync("./js/events").filter((f) => f.endsWith(".js"))) {
    const event = require(`../events/${file}`);
    client.on(event.name, event.run.bind());
    console.log("\x1b[33m%s\x1b[0m", file, "fue cargado correctamente");
}

//load commands
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

//load user
for (const file of fs.readdirSync("./js/user").filter((f) => f.endsWith(".js"))) {
    const user = require("../user/" + file);
    client.userCommands.set(user.name, user);
    console.log("\x1b[32m%s\x1b[0m", file, "fue cargado correctamente");
}

//load buttons
for (const file of fs.readdirSync("./js/buttons").filter((f) => f.endsWith(".js"))) {
    const button = require("../buttons/" + file);
    client.buttons.set(button.id, button);
    console.log("\x1b[35m%s\x1b[0m", file, "fue cargado correctamente");
}

const WebSocket = require('ws');

function WS() {
    ws = new WebSocket('wss://oneki.herokuapp.com/',);

    ws.on('open', function open() {
        console.log('socket conectado')
        // ws.send('{"event":"xd"}')
    });

    ws.on('close',async () => {
        console.log('socket cerrado');
        // fetch(`https://oneki.herokuapp.com`).then(()=>{
        WS()
        // })
    });

    ws.on('error', () => {})
}

// WS()

//login
TOKEN = process.env.NODE_ENV!=='production'?process.env.TOKEN_DISCORD_DEV:process.env.TOKEN_DISCORD
client.login(TOKEN);


// ws = new WebSocket('wss://localhost:3000/');


setInterval(()=>{
    fetch(`https://oneki.herokuapp.com`)
}, 300000)