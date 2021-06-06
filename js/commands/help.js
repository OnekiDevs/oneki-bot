module.exports = {
    name: 'help',
    botPermissions: [],
    usersPermissions: [],
    alias: [],
    run: async (client, message, args) => {
        const embed = await require('../modules/help')(client, require('../../src/commands.json').Entretenimiento, 'de Entretenimento');
        client.api.channels(message.channel.id).messages.post({ 
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
    }
}