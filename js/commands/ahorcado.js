const fetch = require("node-fetch");
const shortid = require("shortid");
module.exports = {
    name: "ahorcado",
    botPermissions: ['MANAGE_MESSAGES'],
    usersPermissions: [],
    alias: [],
    run: async (client, message, args) => {
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
        }, wordShow = {}, validLetters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], m;
        const msg = await message.inlineReply(`\`${word.map(()=>"_").join(' ')}\``);
        while (true) {
            wordShow = {
                a: word.map(i=>{
                    if (!usedLetters.a.includes(i)) return "_";
                    else return i;
                }),
                toString:()=>wordShow.a.join(' ')
            }
            msg.edit(`Usadas: ${usedLetters}\n\`${wordShow}\`\n${life}`);
            if (life.i == 0) return msg.inlineReply(`${message.author} suarte para la próxima, la palabra era **${word.join('')}**`);
            if (!wordShow.a.includes("_")) return msg.inlineReply(`${message.author} GG has ganado`);
            const filter = m => m.author.id == message.author.id && validLetters.includes(m.content.toLowerCase());
            try { 
                m = (await msg.channel.awaitMessages(filter, {max:1, time: 30000, errors: ['time']})).first()
            } catch (e) {
                return msg.inlineReply(`${message.author} Se acabo el tiempo`);
            }
            const l = m.content.toLowerCase().charAt(0);
            if (usedLetters.a.includes(l)) {
                m.inlineReply('Ya has usado esa letra').then(ms => ms.delete({ timeout: 5000 }).then(() =>m.delete()))
            } else {
                m.delete();
                usedLetters.a.push(l);
                if (!word.includes(l)) life.i--;
            }
        }
    }
};