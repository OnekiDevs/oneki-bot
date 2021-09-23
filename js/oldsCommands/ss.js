const puppeteer = require('puppeteer');
const  { MessageAttachment, Permissions } = require('discord.js')
// const {URLSearchParams} = require('url')
module.exports = {
    name: 'ss',
    botPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
    userPermissions: [],
    alias: ['screenshot'],
    run: async (message, args) => {
        // return message.reply('comando temporalmente desactivado por mantenimmiento\nDisculpe las molestias')
        message.channel.sendTyping();
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/ss'});
        // message.delete();
        if (!args[0]) return message.channel.send(lang.fail);
        const browser = await puppeteer.launch({
            args: [
                "--no-sandbox", 
                "--disable-setuid-sandbox"
            ],
            defaultViewport: {
                width: 400, 
                height: 100
            }
        });
        // console.log(args[0], args[0].match(/<@!?(\d{17,19})>/))
        let user, avatar, color, bot, verified, mentions = {}
        // const params = new URLSearchParams().set('text',(!args[0].match(/<@!?(\d{17,19})>/)?args.join(" "):args.slice(1).join(" ")))
        // console.log((!!args[0].match(/<@!?(\d{17,19})>/) && !!args[1]?args.slice(1).join(" "):args.join(" ")));
        
        if (args[0].match(/<@!?(\d{17,19})>/) && message.mentions.members.first() && !!args[1]) {
            user = message.mentions.members.first()?.displayName;
            avatar = message.mentions.users.first()?.displayAvatarURL();
            color=message.mentions.members.first()?.displayHexColor.slice(1);
            bot=message.mentions.users.first()?.bot?'1':'0';
            verified=message.mentions.users.first()?.flags.has('VERIFIED_BOT')?'1':'0';
        } else {
            user = message.member.displayName;
            avatar = message.author.displayAvatarURL();
            color=message.member.displayHexColor.slice(1);
            bot=message.author.bot?'1':'0';
            verified=message.author.flags.has('VERIFIED_BOT')?'1':'0';
        }
        message.mentions.members.map(m=>{
            // params.set(m.id, m.displayName)
            mentions[m.id] = m.displayName
        })
        // if(Object.keys(mentions).length > 0) params += "&mentions=" + JSON.stringify(mentions)
        const params = new URLSearchParams({
            text: (!!args[0].match(/<@!?(\d{17,19})>/) && !!args[1]?args.slice(1).join(" "):args.join(" ")).replace(/</gi, '&#60;').replace(/>/gi, '&#62;'), 
            user, avatar, color, bot, verified, mentions: JSON.stringify(mentions)
          })
        console.log(params);
        // console.log(`\n${params}`);
        const page = await browser.newPage()
        await page.goto(`http://oneki.herokuapp.com/api/fakeDiscordMessage?${params}`);
        message.channel.send({
            files: [new MessageAttachment(await page.screenshot())]
        });
        await browser.close();
    }
}