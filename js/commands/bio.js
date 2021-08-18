const fetch = require("node-fetch");
const shortid = require("shortid");
const { MessageButton, MessageActionRow } = require("discord.js");
module.exports = {
    name: "bio",
    botPermissions: [],
    userPermissions: [],
    alias: ["betrayal.io"],
    run: async (client, message, args) => {
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({ lang: server.lang, route: "commands/bio" });
        console.log(message.member.voice.channel);
        if (!message.member.voice.channel) return message.reply(lang.voice);
        const invite = await message.member.voice.channel.createInvite({
            targetApplication: "773336526917861400",
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
};
