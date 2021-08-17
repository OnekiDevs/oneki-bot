const fetch = require("node-fetch");
const shortid = require("shortid");
const { Permissions } = require("discord.js");
module.exports = {
    name: "ahorcado",
    botPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
    userPermissions: [],
    alias: [],
    run: async (client, message, args) => {
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/ahorcado'});
        const word = require('../../src/words.json')[Math.floor(Math.random() * require('../../src/words.json').length)].split('');
        let life = {
            i:6,
            toString:()=>{
                let l = [];
                for(i=life.i;i;i--) l.push('<3');
                return l.join(' ');
            }
        }, usedLetters = {
            a: [],
            toString:()=>usedLetters.a.join(' ')
        }, wordShow = {}, participants = [], validLetters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], m;
        const msg = await message.reply(lang.loading);
        participants.push(message.author.id);
        message.mentions.users.map(u=>u.id).forEach(u=>participants.push(u));
        while (true) {
            wordShow = {
                a: word.map(i=>{
                    if (!usedLetters.a.includes(i)) return "_";
                    else return i;
                }),
                toString:()=>wordShow.a.join(' ')
            }
            msg.edit(`${lang.used}: ${usedLetters}\n\`${wordShow}\`\n${life}`);
            if (life.i == 0) return msg.reply(`${message.author} ${lang.lose} **${word.join('')}**`);
            if (!wordShow.a.includes("_")) return msg.reply(`${message.author} ${lang.win}`);
            try { 
                m = (await msg.channel.awaitMessages({filter: f => participants.includes(f.author.id) && validLetters.includes(f.content.toLowerCase()), max:1, time: 30000, errors: ['time']})).first()
            } catch (e) {
                return msg.reply(`${message.author} ${lang.timeout}`);
            }
            const l = m.content.toLowerCase().charAt(0);
            if (usedLetters.a.includes(l)) {
                m.reply(lang.repeat).then(ms => ms.delete({ timeout: 5000 }).then(() =>m.delete()))
            } else {
                usedLetters.a.push(l);
                if (!word.includes(l)) life.i--;
                m.delete({ timeout: 500 });
            }
        }
    }
};