const { Permissions } = require('discord.js');
module.exports = {
    name: "ytt",
    botPermissions: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS],
    usersPermissions: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS],
    alias: ["youtubetogether", "youtube-together"],
    run: async (client, message, args) => {
        if (!args[0] || args[0] != "-y"){
            message.channel.send({
                content:"Estas seguro de eliminar **todos** los mensajes de este canal?\nEsta acción no se puede deshacer",
                buttons: [
                    {
                        "style": 1,
                        "label": 'SI',
                        "custom_id": "clear_yes", //id del boton
                        "type": 2
                    },
                    {
                        "style": 4,
                        "label": 'NO',
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