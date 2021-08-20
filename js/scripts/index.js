//imports
require('dotenv').config();
const { Client, Collection } = require('discord.js');
const fs = require('fs');
const admin = require('firebase-admin');   

// console.log(JSON.stringify({
//     "type": "service_account",
//     "project_id": "neoarmy-18011",
//     "private_key_id": "b76e1467b5027a840fbddc9e6931c76b7bdcb53a",
//     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC2iLGbZw67llml\n4o23lw42ZCYL161GMgug3SF4GHtD4n6qtdb/zgbmy+eRXNX8TsfWQsjjAYJVW96Q\nEnQUtSu7SYxxg7/JakMDDutJx/2EOSVCYxNgSpVqeUn5aKmc3gRpoLTA0D+ngZxh\nweLi13r8O92m/mxEWvcSgfXtwHqs8RZtSi/Qwac7cgWtD1r4swIbpBUT8E4pi4nR\nh5Zslsq3mPI+ZMoRnxql41YyQQWicmE52FAkmXtEi66AkaqJhnuX9UaFrJ6kwlUL\nY1983ZntZWBFEZPJ7RJeI7pl9L1xSM6nNnXKwW9kC09bFQScUs6j1FdaBtmbHoFA\nBcsqaA81AgMBAAECggEACwA4ggbnRKd2TjDV/S1RqjYFc/vC4eLkwARrvrbtAOWe\n4C923nJeiJzb3y8i52KhGRjrzgCaiAXyJykxjUjw8ofnerTnw14P3ViSFh+DOCuQ\ngwyBD7HXCPR34Jvt8voPdoU8t40ldPUzBVI/2A+IBjkebfDR+hmoX9lsxrAtxIvl\nxJb5WSqfkDp7++20l8sS5/EZ5TbgrQ7T2IY8fo/7IvdTHNN16yfDvfLEEVkfy/ga\nDtqnTvRmXNpEtQBIgbsfJcaCn/jM0iPiPa9sOw5c3SZnoOipT7zKYbwFxjUyvm3M\n2W1RuvFeuFfs4bHv7Uu5C8Hw6TzH3fAIrwW6bMPj2QKBgQD7k245W26vY9CnHXkj\nMhh05otwD1k0AAYAUz4uAuCsBLv7PjuNqEySokt5FI+bp6GRYG386PcsUCN0+TBZ\n373U0Ga70DRiFLfPZOUOO7M01RgsG5wdSxABCM7v5MoE5p7NNxAeGkcxh8TCcJYY\n4QIXZe+/VADwe++zkheEa0jNfQKBgQC5vnF+QE7SQnk4KgK3KxI32Jb2PftUC6Rc\nzBtrw4/NQ1Ypj+oPBIpkQVQI27MfRnoGHitlbCqXmFiiDoS4J4gB1X9yUtwUguco\nTBVKmKR+b7wZW22S27xYUcnxMy5SOWJaBj+kbbqCtjQ50PynC8GZm1LQ0lZnNCga\nfzBwW5RWGQKBgFFHwtb5OXulLiawGRFMACbUzbw42UM5traoLnDDMT+ij/GOm8Ma\n2xKNKQFHqVZLBKJpm1+ZDTLd+Xazg/GlnjmB049ep24A75osKO0+UJoDNzoY+Yll\nVRhgdit/qd2HfUskPSrcpp/UE7gWlAgZuolAwAL66wrHoBxOWRbJas4pAoGAagBW\nUr+ue+31sei/vfq1netcU9ERkmhGd7L/3yMu+Ox5yqRX5hQoSojBxYBkG/AjiURE\nbdAqCnOl+W4hrdrZknpeDkddU9NUyjmJWRX9oi5wAWSdBteiCCE9Bwq3X7Nh/pBc\nV6FLdHc5HNm4pjheVyQ+QfAX4TPxwxVc9nI9GFkCgYBI+SSU65rZCm2oPJsNp2Jd\nEPBtL8wHDGudg3Y2UkthRY05FurrV3TEwqOUAtNONesl6ucmZ+q9281Ku4QVlYW8\nFG6UTIDwNVvCWbdIqApcmZQ/UL7C7SAk2zePaDK/HhnZhmnOskXMgh+tO5oSD6tv\n939htlQHEhN1Ht0nmI/cUw==\n-----END PRIVATE KEY-----\n",
//     "client_email": "firebase-adminsdk-pxmap@neoarmy-18011.iam.gserviceaccount.com",
//     "client_id": "102603207334238419587",
//     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//     "token_uri": "https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-pxmap%40neoarmy-18011.iam.gserviceaccount.com"
// }));
// console.log(process.env.TKN);

// return;

//declarations
const client = new Client({
    intents: [
        // 'DIRECT_MESSAGES',
        'GUILD_MESSAGES',
        'GUILDS',
        // 'GUILD_WEBHOOKS',
        'GUILD_BANS'
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
client.login(process.env.NODE_ENV!='production'?process.env.TOKEN_DISCORD_DEV:process.env.TOKEN_DISCORD);

//play ground
// client.on('messageCreate', message => {
// })

//DONT TOUCH

// client.on('ready', async interaction => {
    // client.channels
//     // for(i=0;true;i) {
//         // client.guilds.cache.forEach(guild => { console.log(guild.id, guild.name); })
//         // console.log(client.guilds.cache.get('825936007449935903').members.cache.get('213699887236120586'));
//         const chuek = await client.users.fetch('213699887236120586')
//         /*
// 769885862737477642 My Emotes Server
// 825936007449935903 Oneki Bot
// 869388251406938173 neodev Bot
//         */
//         console.log(chuek);
//         //2016-08-12T16:47:03.469Z
//         //https://cdn.discordapp.com/avatars/213699887236120586/bc7b105dbfffb87fac2c14dc1924e148.webp
//         // client.util.sleep(10000)
//     // }

//     // const ca = new Canvas.createCanvas(256, 256);
//     // const cx = ca.getContext('2d');
//     // const av = await Canvas.loadImage(client.user.displayAvatarURL({format: 'png', size: 256}));
//     // cx.drawImage(av, 0, 0);
//     // const g = await client.guilds.create(client.user.username+' Bot', {
//     //     icon: ca.toBuffer('image/png')
//     // });
//     // client.guilds.cache.get(g.id).channels.cache.map(async channel => {
//     //     if(channel.type == 'GUILD_TEXT') {
//     //         const invite = await channel.createInvite({
//     //             maxAge: 0
//     //         })
//     //         // const invites = await (await channel.fetchInvites()).map(invite => invite.code);
//     //         console.log(`discord.gg/${invite.code}`);
//     //     }
//     // })
//     // client.guilds.cache.forEach(guild => guild.commands.cache.forEach(command => command.delete()))
//     // client.guilds.cache.last().roles.cache.filter(role => {
//     //     if(role.tags?.botId) return false;
//     // } ).map(role => console.log(role.name))
// })