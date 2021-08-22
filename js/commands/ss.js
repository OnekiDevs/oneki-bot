const puppeteer = require('puppeteer');
const  { MessageAttachment, Permissions } = require('discord.js')
// const {URLSearchParams} = require('url')
module.exports = {
    name: 'ss',
    botPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
    userPermissions: [],
    alias: ['screenshot'],
    run: async (client, message, args) => {
<<<<<<< HEAD
        const channel = message.channel;
        channel.startTyping();
=======
        message.channel.sendTyping();
>>>>>>> 47d6f8f2c7f57848d2b154824336c90549c3148a
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/ss'});
        message.delete();
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
        let params = "text="+(!args[0].match(/<@!?(\d{17,19})>/)?args.join(" "):args.slice(1).join(" ")), mentions = {}
        // const params = new URLSearchParams().set('text',(!args[0].match(/<@!?(\d{17,19})>/)?args.join(" "):args.slice(1).join(" ")))
        message.mentions.members.map(m=>{
            // params.set(m.id, m.displayName)
            mentions[m.id] = m.displayName
        })
        if(Object.keys(mentions).length > 0) params += "&mentions=" + JSON.stringify(mentions)
        if (args[0].match(/<@!?(\d{17,19})>/) && message.mentions.members.first()) {
            // params.set('user', message.mentions.members.first()?.displayName)
            // params.set('avatar', message.mentions.members.first()?.displayAvatarURL())
            // params.set('color', message.mentions.members.first()?.displayHexColor.slice(1))
            // params.set('bot', message.mentions.users.first()?.bot?'1':'0')
            // params.set('verified', message.mentions.users.first()?.flags.has('VERIFIED_BOT')?'1':'0')
            params += `&user=${message.mentions.members.first()?.displayName}`;
            params += `&avatar=${message.mentions.users.first()?.displayAvatarURL()}`;
            params += `&color=${message.mentions.members.first()?.displayHexColor.slice(1)}`
            params += `&bot=${message.mentions.users.first()?.bot?'1':'0'}`
            params += `&verified=${message.mentions.users.first()?.flags.has('VERIFIED_BOT')?'1':'0'}`
        } else {
            // params.set('user', message.member.displayName)
            // params.set('avatar', message.author.displayAvatarURL())
            // params.set('color', message.member.displayHexColor.slice(1))
            // params.set('bot', message.author.bot?'1':'0')
            // params.set('verified', message.author.flags.has('VERIFIED_BOT')?'1':'0')
            params += `&user=${message.member.displayName}`;
            params += `&avatar=${message.author.displayAvatarURL()}`;
            params += `&color=${message.member.displayHexColor.slice(1)}`
            params += `&bot=${message.author.bot?'1':'0'}`
            params += `&verified=${message.author.flags.has('VERIFIED_BOT')?'1':'0'}`
        }
<<<<<<< HEAD
        const page = await browser.newPage();
        await page.goto(`http://koneweb.herokuapp.com/api/fakeDiscordMessage?${params}`);
        const ss = await page.screenshot();
        const attachment = new MessageAttachment(ss);
        console.log(attachment);
        channel.send({files:[attachment]}).catch(err => {
            console.log("ERROR", err);
        })
        await browser.close();
        channel.stopTyping();
=======
        const page = await browser.newPage()
        await page.goto(`http://oneki.herokuapp.com/api/fakeDiscordMessage?${params}`);
        message.channel.send({
            files: [new MessageAttachment(await page.screenshot())]
        });
        await browser.close();
>>>>>>> 47d6f8f2c7f57848d2b154824336c90549c3148a
    }
}