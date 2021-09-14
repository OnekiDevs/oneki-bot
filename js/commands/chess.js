const shortid = require("shortid");
const {MessageActionRow, MessageButton} = require("discord.js");
module.exports = class Ping extends require('../classes/Command'){

    constructor() {
        super({
            name: 'chess',
            aliases: ['ajedrez'],
            permissions: {
                bot: [],
                member: []
            },
            cooldown: 0,
            args: []
        })

    }

    async run(message, args) {
        const server = client.servers.get(message.guild.id);
        const lang = util.lang({lang:server.lang, route:'commands/chess'});
        const messageMention = message.mentions.channels.first()
        let messageVoiceChannel;
        if (!message.member.voice.channel) {
            if (messageMention == undefined) {
                return message.reply(lang.voice);
            } else {
                if (messageMention.type === "GUILD_VOICE") {
                    messageVoiceChannel = messageMention;
                } else {
                    return message.reply(lang.voice)
                }
            }
        } else {
            messageVoiceChannel = message.member.voice.channel;
        }

        const invite = await messageVoiceChannel.createInvite({
            targetApplication: "832012774040141894",
            targetType: 2,
        });
        const ID = shortid.generate();
        message.reply({
            content: `${await client.util.replace(lang.message, [
                { match: "{user}", replace: message.member.displayName },
            ])}`,
            components: [
                new MessageActionRow().addComponents([
                    new MessageButton()
                        .setLabel(lang.accept)
                        .setStyle("LINK")
                        .setURL(`https://discord.com/invite/${invite.code}`),
                    new MessageButton().setLabel(lang.invitation).setStyle("PRIMARY").setCustomId(ID),
                ]),
            ],
        });
        client.buttons.set(ID, {
            params: {
                url: `https://discord.com/invite/${invite.code}`,
            },
            run: (client, interact, { url }) => {
                interact.reply({
                    content: url,
                    ephemeral: true,
                });
            },
        });
    }

}