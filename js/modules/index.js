const { resolve } = require('path');
const Canvas = require('canvas');

module.exports = async (dev) => {
    //imports
    require('dotenv').config();
    const { Client, Collection } = require('discord.js');
    const fs = require('fs');
    const admin = require('firebase-admin');    

    //declarations
    const client = new Client({
        intents: [
            'DIRECT_MESSAGES',
            'GUILD_MESSAGES',
            'GUILDS',
            'GUILD_WEBHOOKS',
            'GUILD_BANS'
        ]
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
    client.login(dev?process.env.TOKEN_DISCORD_DEV:process.env.TOKEN_DISCORD);

    //play ground 
    
    // client.on('messageCreate', message => {
        // client.guilds.cache.forEach(g => {

        // })
        //              createMessageComponentCollector
        // message.channel.createMessageComponentCollector
        // const collector = message.createMessageComponentInteractionCollector((mci)=>mci.customID.startsWith('uno_i_')||mci.customID.startsWith('uno_c_'), {
        //     max: 
        // });
        // collector.on('collect', collect => {
        //     collect.deferUpdate({
        //         ephemeral: true
        //     })
        //     collect.reply({
        //         content: ''
        //     })
        // })
    // })

    //DONT TOUCH
    
    // client.on('ready', async interaction => {
    //     const ca = new Canvas.createCanvas(256, 256);
    //     const cx = ca.getContext('2d');
    //     const av = await Canvas.loadImage(client.user.displayAvatarURL({format: 'png', size: 256}));
    //     cx.drawImage(av, 0, 0);
    //     const g = await client.guilds.create(client.user.username+' Bot', {
    //         icon: ca.toBuffer('image/png')
    //     });
    //     client.guilds.cache.get(g.id).channels.cache.map(async channel => {
    //         if(channel.type == 'GUILD_TEXT') {
    //             const invite = await channel.createInvite({
    //                 maxAge: 0
    //             })
    //             // const invites = await (await channel.fetchInvites()).map(invite => invite.code);
    //             console.log(`discord.gg/${invite.code}`);
    //         }
    //     })
    // })
}