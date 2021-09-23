class myArray extends Array {
    constructor(...ar) {super(...ar)}
    toString(){return this.join(' ')}
}
class Life {
    life=5
    constructor(life){this.life=life}
    toString(){return '<3'.repeat(this.life)}
    subtract(){this.life--}
    add(){this.life++}
}
module.exports = class Hangman extends require('../classes/Command'){

    constructor() {
        super({
            name: 'hangman',
            aliases: ['ahorcado'],
            permissions: {
                bot: ['MANAGE_MESSAGES'],
                member: []
            },
            cooldown: 0,
            args: []
        })

    }

    async run(message, args) {
        const server = client.servers.get(message.guild.id);
        const lang = util.lang({lang:server.lang, route:'commands/ahorcado'});
        const word = require('../../src/words.json')[Math.floor(Math.random() * require('../../src/words.json').length)].split('');
        let life = new Life(6), usedLetters = new myArray(), wordShow = new myArray(), participants = [message.author.id], validLetters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], m;
        const msg = await message.reply(lang.loading);
        message.mentions.users.map(u=>u.id).forEach(u=>participants.push(u));
        while (true) {
            word.map((i,u)=>{
                if (!usedLetters.includes(i)) wordShow[u] = "_";
                else wordShow[u] = i;
            })
            msg.edit(`${lang.used}: ${usedLetters}\n\`${wordShow}\`\n${life}`);
            if (life == 0) return msg.reply(`${message.author} ${lang.lose} **${word.join('')}**`);
            if (!wordShow.includes("_")) return msg.reply(`${message.author} ${lang.win}`);
            try {
                m = (await msg.channel.awaitMessages({filter: f => participants.includes(f.author.id) && validLetters.includes(f.content.toLowerCase()), max:1, time: 30000, errors: ['time']})).first()
            } catch (e) {
                return msg.reply(`${message.author} ${lang.timeout}`);
            }
            const l = m.content.toLowerCase().charAt(0);
            if (usedLetters.includes(l)) {
                m.reply(lang.repeat).then(ms => ms.delete({ timeout: 5000 }).then(() =>m.delete()))
            } else {
                usedLetters.push(l);
                if (!word.includes(l)) life.subtract();
                m.delete({ timeout: 500 });
            }
        }
    }

}