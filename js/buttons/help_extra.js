const  { MessageEmbed } = require('discord.js');
module.exports.run = async (client, interact, params) => {
    const server = client.servers.get(interact.guildID);
    const lang = client.util.lang({lang:server.lang, route:'commands/help/help'}).buttons;
    const embed = await require('../modules/help')(client, require('../../src/commands.json').Extra, 'Extra', interact.guildID);
    client.api.channels(interact.channelID).messages(interact.message.id).patch({ 
        data: {
            embed: embed,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            style: 1,
                            label: lang.entertainment,
                            custom_id: 'help_entretenimiento',
                            type: 2
                        },
                        {
                            style: 1,
                            label: lang.help,
                            custom_id: 'help_ayuda',
                            type: 2
                        },
                        {
                            style: 1,
                            label: lang.moderation,
                            custom_id: 'help_moderacion',
                            type: 2
                        },
                        {
                            style: 1,
                            label: lang.extra,
                            custom_id: 'help_extra',
                            type: 2
                        }
                    ]
                }
            ]
        }
    });
    interact.deferUpdate();
}
module.exports.id = 'help_extra';