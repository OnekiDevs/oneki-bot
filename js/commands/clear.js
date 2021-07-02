const { Permissions } = require('discord.js');
module.exports = {
    name: "clear",
    botPermissions: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS],
    usersPermissions: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS],
    alias: [],
    run: async (client, message, args) => {
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/moderation/clear'});
        if (!args[0] || args[0] != "-y"){
            message.channel.send({
                content:lang.sure,
                buttons: [
                    {
                        "style": 1,
                        "label": lang.buttons.yes,
                        "custom_id": "clear_yes", //id del boton
                        "type": 2
                    },
                    {
                        "style": 4,
                        "label": lang.buttons.no,
                        "custom_id": "clear_no", //id del boton
                        "type": 2
                    }
                ]
            });
        } else {
            const canal = await message.channel.clone();
            canal.setPosition(message.channel.position);
            message.channel.delete();
        }
    }
}