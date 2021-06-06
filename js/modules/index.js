module.exports = async (dev) => {
    //imports
    require('dotenv').config();
    const { Client, Collection } = require('discord.js');
    const fs = require('fs');
    const admin = require('firebase-admin');    

    //declarations
    require("./extendedMessage");
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
    client.commands = new Collection();
    client.util = require('../modules/util');
    client.buttons = new Collection();
    client.slash = new Collection();
    const serviceAccount = require("../../src/firebase-key.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    const db = admin.firestore();

    //load config
    db.collection('servers').doc(dev?process.env.SERVER_DEV:process.env.SERVER).get().then(snapshot => {
        client.settings = {
            dmChannel: snapshot.data()?.dmChannel??"832788680200028212",
            guild: snapshot.data()?.id??"825936007449935903",
            prefix: snapshot.data()?.prefix??'r!',
        }
    })
    

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
        client.slash.set(slash.data.name, slash);
        console.log("\x1b[32m%s\x1b[0m", file, "fue cargado correctamente");
    }

    //load buttons
    for (const file of fs.readdirSync("./js/buttons").filter((f) => f.endsWith(".js"))) {
        const button = require("../buttons/" + file);
        client.buttons.set(button.id, button);
        console.log("\x1b[35m%s\x1b[0m", file, "fue cargado correctamente");
    }

    client.ws.on('INTERACTION_CREATE', async interact => {
        try {
            let cmd = client.slash.get(interact.data.name)??client.buttons.get(interact.data.custom_id);
            if (cmd) cmd.run(client, interact, cmd.params);
        } catch (error) {
            client.emit('error', client, error, `Channel: <#${interact.channel_id}>\nServer: ${interact.guild_id}\nInteract: ${interact.data?JSON.stringify(interact.data):''}`)
            // require('./error')(client, error, `/${cmd?.data.name}`, interact.data.toString(), interact.guild_id, { id:interact.guild_id, name:client.guilds.cache.get(interact.guild_id)?.name })
        }
    });

    //login
    client.login(dev?process.env.TOKEN_DISCORD_DEV:process.env.TOKEN_DISCORD);

    // if (dev) {
    //     const exec = require('child_process').exec;
    //     exec('py .\\py\\main.py', (err, stdout) => {
    //         if (err) console.error(err);
    //         if (stdout) console.log(stdout);
    //     })
    // }
}