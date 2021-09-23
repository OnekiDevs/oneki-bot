const fetch = require("node-fetch");
const {MessageEmbed} = require("discord.js");
module.exports = class Emoji extends require('../classes/Command'){

    constructor() {
        super({
            name: 'emoji',
            aliases: [],
            permissions: {
                bot: [],
                member: []
            },
            cooldown: 0,
            args: []
        })

    }

    //TODO agregar lenguaje a este comando

    run(message, args) {
        const emojiString = (message.content.match(/<a?:(.+):\d{18}>/)??args)[0]
        const emojiId = (emojiString??'').replace(/<a?:(.+):/, '').replace(/>/, '');
        if (args[0] && (/\d{18}/).test(emojiId)) {
            fetch(`https://cdn.discordapp.com/emojis/${emojiId}.gif`).then(a=>{
                if (a.status != 200) {
                    fetch(`https://cdn.discordapp.com/emojis/${emojiId}.png`).then(e=>{
                        if (e.status != 200) message.reply('Emoji no encontrado');
                        else message.reply({ embeds: [new MessageEmbed().setColor("#ffffff").setImage(e.url).addField("Enlace", `[PNG](${e.url})`)] })
                    })
                } else message.reply({ embeds: [new MessageEmbed().setColor("#ffffff").setImage(a.url).addField("Enlace", `[GIF](${a.url})`)] })
            })
        } else message.reply('necesitas mencionar un emoji o id');
    }

}