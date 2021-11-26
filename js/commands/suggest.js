const { MessageEmbed } = require('discord.js')
const FieldValue = require('firebase-admin').firestore.FieldValue;
module.exports = class Suggest extends require('../classes/Command'){

    constructor() {
        super({
            name: 'suggest',
            aliases: ['sugerencia', 'suggestion', 'sugerir'],
            permissions: {
                bot: [],
                member: []
            },
            cooldown: 0,
            args: []
        })

    }

    async run(message, args) {
        if(message.author.bot) return;
        const pkg = require("../../package.json");
        const server = client.servers.get(message.guild.id);
        const lang = util.lang({lang:server.lang, route:'commands/sugerir'});
        const snapshot = await db.collection(message.guild.id).doc("suggest").get();
        if (!snapshot.exists) return;
        if (args.length < 1) return message.reply(`${await util.replace(lang.use, [{match:"{prefix}", replace:server.prefix}])}`);
        const channelid = snapshot.data()[args[0]];
        console.log(channelid, !!channelid, args.length < 2, !!channelid && args.length < 2);
        if (!!channelid && args.length < 2) return message.reply(`${await util.replace(lang.use, [{match:"{prefix}", replace:server.prefix}])}`);
        const channel = message.guild.channels.cache.get(channelid ?? snapshot.data().predetermined);
        if (!channel) return;
        await client.application.fetch()
        message.delete().catch(err => {})
        const embed = new MessageEmbed();
        embed.setAuthor(message.author.username, message.author.displayAvatarURL());
        embed.setTitle(`Sugerencia # ${snapshot.data().lastId?+snapshot.data().lastId+1:1}`);
        embed.setColor(16313844);
        embed.setDescription(channelid ? args.slice(1).join(' ') : args.join(' '));
        embed.setFooter(`${client.user.username} Bot ${pkg.version}`, client.user.avatarURL());
        embed.setTimestamp();
        const m = await channel.send({
            embeds: [embed],
            files: message.attachments.map(i=>i)
        });
        m.react(client.constants.emojis.yes).then(()=>m.react(client.constants.emojis.no).then(()=>m.startThread({
            name: `Sugerencia ${snapshot.data().lastId?+snapshot.data().lastId+1:1}`
        })))
        db.collection(message.guild.id).doc('suggest').update({
            lastId: snapshot.exists ? FieldValue.increment(1) : 1
        }).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection(message.guild.id).doc('suggest').set({
                lastId: snapshot.exists ? FieldValue.increment(1) : 1
            });
        });
        db.collection(`${message.guild.id}`).doc('suggest').collection('suggestions').doc((snapshot.data().lastId?+snapshot.data().lastId+1:1).toString()).set({
            channel: m.channel.id,
            author: message.author.id,
            suggest: channelid ? args.slice(1).join(' ') : args.join(' ')
        });
    }

}