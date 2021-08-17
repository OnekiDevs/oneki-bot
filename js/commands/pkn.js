const fetch = require("node-fetch");
const shortid = require("shortid");
module.exports = {
    name: "pkn",
    botPermissions: [],
    userPermissions: [],
    alias: ["pokernight", "poker-night"],
    run: async (client, message, args) => {
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/pkn'});
        const channel = message.mentions.channels.find((m) => m.type == "GUILD_VOICE");
        if (!channel) return message.reply(lang.mention);
        const invite = await channel.createInvite({
            targetApplication: "755827207812677713",
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
