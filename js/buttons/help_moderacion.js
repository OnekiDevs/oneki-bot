const  { MessageEmbed } = require('discord.js');
module.exports.run = async (client, interact, params) => {
    const embed = await require('../modules/help')(client, require('../../src/commands.json').Moderacion, 'de Moderacion');
    client.api.channels(interact.channel_id).messages(interact.message.id).patch({ 
        data: {
            embed: embed,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            style: 1,
                            label: 'Entretenimiento',
                            custom_id: 'help_entretenimiento',
                            type: 2
                        },
                        {
                            style: 1,
                            label: 'Ayuda',
                            custom_id: 'help_ayuda',
                            type: 2
                        },
                        {
                            style: 1,
                            label: 'Moderación',
                            custom_id: 'help_moderacion',
                            type: 2
                        },
                        {
                            style: 1,
                            label: 'Extra',
                            custom_id: 'help_extra',
                            type: 2
                        }
                    ]
                }
            ]
        }
    });
    client.api.interactions(interact.id, interact.token).callback.post({
        data: {
            type: 6
        }
    });
}
module.exports.id = 'help_moderacion';