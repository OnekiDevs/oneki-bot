const fetch = require("node-fetch");
const shortid = require("shortid");
module.exports = {
    name: "ytt",
    botPermissions: [],
    userPermissions: [],
    alias: ["youtubetogether", "youtube-together"],
    run: async (client, message, args) => {
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/ytt'});
        const channel = message.mentions.channels.find(m => m.type == 'voice');
        if (!channel) return message.inlineReply("Menciona un canal de voz");
        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "755600276941176913",
                target_type: 2,
                temporary: false,
                validate: null,
            }),
            headers: {
                Authorization: `Bot ${client.token}`,
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then(async (invite) => {
            const ID = shortid.generate();
            if (!invite.code || invite.errors) return message.reply(lang.fail);
            else {
                const accept = new MessageButton().setLabel(lang.accept).setStyle('LINK').setURL(`https://discord.com/invite/${invite.code}`);
                const invite = new MessageButton().setLabel(lang.invite).setStyle('PRIMARY').setCustomID(ID);
                message.reply({
                    content: `${await client.utiles.replace(lang.message, [{match:"{user}", replace:message.member.displayName}])}`, 
                    components: [[accept, invite]]
                });
                client.buttons.set(ID, {
                    params: {
                        url: `https://discord.com/invite/${invite.code}`,
                    },
                    run: (client, interact, { url }) => {
                        interact.reply({
                            content: url,
                            ephemeral: true
                        })
                    }
                });
            }
        });
    },
};
