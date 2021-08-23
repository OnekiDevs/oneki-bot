module.exports = {
    name: 'ping',
    alias: [],
    userPermissions: [],
    botPermissions: [],
    run: async (client, message, args) => {
        return message.reply('pong');
    }
}