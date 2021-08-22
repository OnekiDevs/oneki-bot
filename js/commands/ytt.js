const fetch = require("node-fetch");
const { MessageButton, MessageActionRow } = require("discord.js");
const shortid = require("shortid");
module.exports = {
    name: "ytt",
    botPermissions: [],
    userPermissions: [],
    alias: ["youtubetogether", "youtube-together"],
    run: async (client, message, args) => {
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/ytt'});
        if (!message.member.voice.channel) return message.reply(lang.voice);
        const invite = await message.member.voice.channel.createInvite({
            targetApplication: "755600276941176913",
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
    },
};
