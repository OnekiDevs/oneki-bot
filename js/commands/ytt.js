const fetch = require("node-fetch");
const shortid = require("shortid");
module.exports = {
    name: "ytt",
    botPermissions: [],
    alias: ["youtubetogether", "youtube-together"],
    run: async (client, message, args) => {
        const channel = message.member.voice.channel;
        console.log(channel);
        if (!channel) return message.inlineReply("No estas en un canal de voz");
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
        .then((invite) => {
            const ID = shortid.generate();
            if (!invite.code || invite.errors) return message.inlineReply("Lamentablemente no puedo usar ytt");
            else {
                client.api.channels(message.channel.id).messages.post({
                    data: {
                        content: `${message.member.displayName} te esta invitando a ver YouTube juntos`,
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
                        return new Promise((resolve, reject) => {
                            resolve({
                                type: 4,
                                data: {
                                    content: url,
                                    flags: 1 << 6,
                                },
                            });
                        });
                    },
                });
            }
        });
    },
};
