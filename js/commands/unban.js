module.exports = {
    name: 'unban',
    description: 'Revoca el ban a un miembro de un servidor, tienes que proporcionar un ID (Solo para gente con permiso "Administrador" o "Banear")',
    guildOnly: true,
    usage: '[User ID]',
    alias: [],
    run: async (client, message, args) => {
        if (!message.member.hasPermission(['BAN_MEMBERS'])) {
            message.reply('no tienes los suficientes permisos para hacer esto');
            return;
        }

        const userToUnbanID = args[0];
        if (!userToUnbanID) return;
        message.guild.members.unban(userToUnbanID);
        return message.inlineReply('A el usuario se le ha revocado el ban exitosamente!');
    },
};