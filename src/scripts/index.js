//imports
require('dotenv').config();
const { Client, Collection } = require('discord.js');
const fs = require('fs');

//declarations
// require("./ExtendedMessage");
const client = new Client({
    ws: {
        intents: [
            'DIRECT_MESSAGES',
            'GUILD_MESSAGES',
            'GUILDS',
            'GUILD_WEBHOOKS'
        ]
    }
});

//login
client.login(process.env.TOKEN_DISCORD);

//load events
const eventos = fs.readdirSync("./src/events").filter((f) => f.endsWith(".js"));
for (const file of eventos) {
    let event = require(`../events/${file}`);
    client.on(event.name, event.run.bind(null, client));
    console.log("\x1b[33m%s\x1b[0m", file, "fue cargado correctamente");
}

client.on('message', message => {
    // const guild = message.guild;
    // guild.channels.cache.get('')
})