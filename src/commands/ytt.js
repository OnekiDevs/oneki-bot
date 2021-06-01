const fetch = require('node-fetch');
module.exports = {
    name: 'ytt',
    botPermissions: [],
    alias: [],
    run: async (client, message, args) => {
       const channel = message.member.voice.channel;
       if (!channel) return message.inlineReply('No estas en un canal de voz');
       fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
           method: 'POST',
           body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: '755600276941176913',
                target_type: 2,
                temporary: false,
                validate: null
           }),
           headers: {
               "Authorization": `Bot ${client.token}`,
               "Content-Type": "application/json"
           }
       }).then(response => response.json()).then(invite => {
           if (!invite.code || invite.errors) return message.inlineReply("Sadly i can't start ytt");
           else client.api.channels(message.channel.id).messages.post({
                data: {
                    content: 'Invite',  
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    url: `https://discord.com/invite/${invite.code}`,
                                    "style": 5,
                                    "label": 'Click me',
                                }
                            ]
                        }
                    ],
                    message_reference: {
                        message_id: message.id
                      }
                }
           })
       })
    }
}