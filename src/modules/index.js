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
    client.slash = new Collection();
    const serviceAccount = require("../../firebase-key.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    const db = admin.firestore();

    //load config
    const snapshot = await db.collection('servers').doc(dev?process.env.SERVER_DEV:process.env.SERVER).get();
    client.settings = {
        dmChannel: snapshot.data().dmChannel,
        guild: snapshot.data().id,
        prefix: snapshot.data().prefix??'n!',
    }

    //load events
    const eventos = fs.readdirSync("./src/events").filter((f) => f.endsWith(".js"));
    for (const file of eventos) {
        const event = require(`../events/${file}`);
        client.on(event.name, event.run.bind(null, client));
        console.log("\x1b[33m%s\x1b[0m", file, "fue cargado correctamente");
    }

    //load commands
    const commandsDir = fs.readdirSync("./src/commands").filter((f) => f.endsWith(".js"));
    for (const file of commandsDir) {
        const command = require("../commands/" + file);
        client.commands.set(command.name, command);
        console.log("\x1b[36m%s\x1b[0m", file, "fue cargado correctamente");
    }

    //load slash
    const slashDir = fs.readdirSync("./src/slash").filter((f) => f.endsWith(".js"));
    for (const file of slashDir) {
        const slash = require("../slash/" + file);
        client.slash.set(slash.data.name, slash);
        console.log("\x1b[32m%s\x1b[0m", file, "fue cargado correctamente");
    }

    client.ws.on('INTERACTION_CREATE', async interact => {
        let cmd;
        try {
            cmd = await client.slash.get(interact.data.name);
            if (cmd) {
                const response = await cmd.run(client, interact);
                let r = await client.api.interactions(interact.id, interact.token).callback.post({data: response});
                console.log(r);
            }
        } catch (error) {
            require('./error')(client, error, `/${cmd?.data.name}`, interact.data.toString(), interact.guild_id, { id:interact.guild_id, name:client.guilds.cache.get(interact.guild_id)?.name })
        }
    });

    //login
    client.login(dev?process.env.TOKEN_DISCORD_DEV:process.env.TOKEN_DISCORD);
}