const {MessageEmbed} = require('discord.js')
const fetch = require('node-fetch')
const puppeteer = require('puppeteer');
const errorEmbed = require('../scripts/errorEmbed')
module.exports = {
    name: 'emoji',
    alias: [],
    userPermissions: [],
    botPermissions: [],
    run: async (client, message, args) => {
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
        } else message.reply('error de argumentos');



        // let emojiEmbed = new MessageEmbed()
        //     .setColor("#ffffff")
        // const discordCdn = 'https://cdn.discordapp.com/emojis/'
        // const browser = await puppeteer.launch({devtools: true})
        // if (args.length < 1) {
        //     return message.reply("Uso: ```emoji [Emoji / Emoji ID / ID del mensaje que tenga un emoji en este canal] [img / anim (Si pusiste ID)]```")
        // }
        // if (args[0].startsWith("<:") || args[0].startsWith("<a:")) {
        //     let emojiId = args[0].substring(
        //         args[0].lastIndexOf(':') + 1,
        //         args[0].lastIndexOf('>'),
        //     );
        //     if (args[0].includes("<a:")) {
        //         emojiEmbed.setImage(`${discordCdn}${emojiId}.gif?v=1`)
        //         emojiEmbed.addField("Enlace", `[GIF](${discordCdn}${emojiId}.gif?v=1)`)
        //         console.log(emojiEmbed)
        //         return message.reply({embeds: [emojiEmbed]})
        //     } else {
        //         emojiEmbed.setImage(`${discordCdn}${emojiId}.png`)
        //         emojiEmbed.addField("Enlace", `[PNG](${discordCdn}${emojiId}.png)`)
        //         // return message.reply(`${discordCdn}${emojiId}.png?size=64`)
        //         console.log(emojiEmbed)
        //         return message.reply({embeds: [emojiEmbed]})
        //     }
        // }
        // if (args[0].match(/\d/g)) {
        //     let isMsgID;
        //     const page = await browser.newPage()
        //     await page.goto(`${discordCdn}${args[0]}`).catch((err) => {
        //         console.log(err)
        //         message.channel.messages.fetch(args[0])
        //             .then(msg => {
        //                 // if (args[0].startsWith("<:") || args[0].startsWith("<a:")){
        //                 console.log(msg.content.includes("<:"))
        //                 if (msg.content.includes("<:") || msg.content.includes("<a:")) {
        //                     let emojiId = msg.content.substring(
        //                         msg.content.lastIndexOf(':') + 1,
        //                         msg.content.lastIndexOf('>'),
        //                     );
        //                     emojiEmbed.setImage(`${discordCdn}${emojiId}.png`)
        //                     emojiEmbed.addField("Enlace", `[PNG](${discordCdn}${emojiId}.png)`)
        //                     return message.reply({embeds: [emojiEmbed]})
        //                 }
        //             })
        //     })

        //     if (args[1] === "anim" && args[1] !== undefined) {
        //         emojiEmbed.setImage(`${discordCdn}${args[0]}.gif?v=1`)
        //         emojiEmbed.addField("Enlace", `[GIF](${discordCdn}${args[0]}.gif?v=1)`)
        //     } else if (args[1] === "img" && args[1] !== undefined) {
        //         emojiEmbed.setImage(`${discordCdn}${args[0]}.png`)
        //         emojiEmbed.addField("Enlace", `[PNG](${discordCdn}${args[0]}.png)`)
        //     } else {
        //         message.reply({embeds: [errorEmbed('emoji [img / anim (Si pusiste ID)]', '[img / anim (Si pusiste ID)]')]});
        //     }
        //     return message.reply({embeds: [emojiEmbed]})
        // }
        // message.reply({embeds: [errorEmbed('emoji [Emoji/Emoji ID/ID MSG con emoji en este canal]', '[Emoji/Emoji ID/ID MSG con emoji en este canal]')]});
        // return message.reply('Emoji no encontrado, asegurate que sea un Emoji o una ID de un emoji **no animado** de cualquier servidor (No pegatinas ni Emojis predeterminados, e.g "👍")')
    }
}