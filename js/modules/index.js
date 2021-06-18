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
    client.servers = new Collection();
    client.slash = new Collection();
    client.uno = new Collection();
    const serviceAccount = require("../../src/firebase-key.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    const db = admin.firestore();

    //load config
    db.collection(`config`).doc('bot').onSnapshot(doc => {
        client.settings = {
            prefix: doc.data()?.prefix??'r!',
            dmChannel: "832788680200028212",
            guild: "825936007449935903"
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
            else if ((/uno_i_.{9}/g).test(interact.data.custom_id)) {
                require('./uno').ingresar(client, interact);
            } else if ((/uno_c_.{9}/g).test(interact.data.custom_id)) {
                require('./uno').comenzar(client, interact);
            } else if ((/uno_m_.{9}/g).test(interact.data.custom_id)) {
                require('./uno').mostrar(client, interact);
            } else if ((/uno_e_.{9}/g).test(interact.data.custom_id)) {
                console.log(interact.data.custom_id);
            }
        } catch (error) {
            console.log(error);
            client.emit('error', client, error, `Channel: <#${interact.channel_id}>\nServer: ${interact.guild_id}\nInteract: ${interact.data?JSON.stringify(interact.data):''}`)
            // require('./error')(client, error, `/${cmd?.data.name}`, interact.data.toString(), interact.guild_id, { id:interact.guild_id, name:client.guilds.cache.get(interact.guild_id)?.name })
        }
    });

    //login
    client.login(dev?process.env.TOKEN_DISCORD_DEV:process.env.TOKEN_DISCORD);
    // const cartas = ['0r', '1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '0y', '1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '0b', '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '0g', '1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', '1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', 'py', 'pb', 'pg', 'pr', 'py', 'pb', 'pg', 'pr', 'cy', 'cb', 'cg', 'cr', 'cy', 'cb', 'cg', 'cr', 'ry', 'rb', 'rr', 'rg', 'ry', 'rb', 'rr', 'rg', 'cc', 'cc', 'cc', 'cc', 'cb', 'cr', 'cg', 'cy', 'cb', 'cr', 'cg', 'cy'];

}