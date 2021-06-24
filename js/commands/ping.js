module.exports = {
    name: 'ping',
    alias: [],
    usersPermissions: [],
    botPermissions: [],
    run: async (client, message, args) => {
        return message.reply('pong');
    }
}