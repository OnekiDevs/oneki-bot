const fetch = require("node-fetch");
const shortid = require("shortid");
module.exports = {
    name: "pkn",
    botPermissions: [],
    usersPermissions: [],
    alias: ["pokernight", "poker-night"],
    run: async (client, message, args) => {
        const channel = message.mentions.channels.find(m => m.type == 'voice');
        if (!channel) return message.inlineReply("Menciona un canal de voz");
        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "755827207812677713",
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
        .then((invite) => {
            const ID = shortid.generate();
            if (!invite.code || invite.errors) return message.inlineReply("Lamentablemente no puedo usar pn");
            else {
                client.api.channels(message.channel.id).messages.post({
                    data: {
                        content: `${message.member.displayName} te esta invitando a jugar Poker Night juntos`,
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        url: `https://discord.com/invite/${invite.code}`,
                                        style: 5,
                                        label: "Aceptar",
                                    },
                                    {
                                        type: 2,
                                        custom_id: ID,
                                        style: 1,
                                        label: "Invitacion",
                                    },
                                ],
                            },
                        ],
                        message_reference: {
                            message_id: message.id,
                        },
                    },
                });
                client.buttons.set(ID, {
                    params: {
                        url: `https://discord.com/invite/${invite.code}`,
                    },
                    run: (client, interact, { url }) => {
                        interact.reply({ 
                            content: url,
                            ephemeral: true
                        });
                    },
                });
            }
        });
    },
};
