module.exports = {
    name: 'help',
    botPermissions: [],
    usersPermissions: [],
    alias: [],
    run: async (client, message, args) => {
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/help/help'}).buttons;
        const embed = await require('../modules/help')(client, require('../../src/commands.json').Entretenimiento, 'de Entretenimento', message.guild.id);
        client.api.channels(message.channel.id).messages.post({ 
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
    }
}