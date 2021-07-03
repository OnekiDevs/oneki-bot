const puppeteer = require('puppeteer');
const  { MessageAttachment, Permissions } = require('discord.js')
module.exports = {
    name: 'ss',
    botPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
    usersPermissions: [],
    alias: [],
    run: async (client, message, args) => {
        message.channel.startTyping();
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/fun/ss'});
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
        let params = "text="+(!args[0].match(/<@!?(\d{17,19})>/)?args.join(" "):args.slice(1).join(" "));
        if (args[0].match(/<@!?(\d{17,19})>/)) {
            params += `&user=${message.mentions.members.first().displayName}`;
            params += `&avatar=${message.mentions.users.first().displayAvatarURL()}`;
            params += `&color=${message.mentions.members.first().displayHexColor.slice(1)}`
            params += `&bot=${message.mentions.users.first().bot?'1':'0'}`
            params += `&verified=${message.mentions.users.first().flags.has('VERIFIED_BOT')?'1':'0'}`
        } else {
            params += `&user=${message.member.displayName}`;
            params += `&avatar=${message.author.displayAvatarURL()}`;
            params += `&color=${message.member.displayHexColor.slice(1)}`
            params += `&bot=${message.author.bot?'1':'0'}`
            params += `&verified=${message.author.flags.has('VERIFIED_BOT')?'1':'0'}`
        }
        const page = await browser.newPage();
        await page.goto(`http://koneweb.herokuapp.com/api/fakeDiscordMessage?${params}`);
        const ss = await page.screenshot();
        const attachment = new MessageAttachment(ss);
        message.channel.send(attachment);
        await browser.close();
        message.channel.stopTyping();
    }
}