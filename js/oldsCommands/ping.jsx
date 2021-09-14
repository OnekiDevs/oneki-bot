module.exports = {
    name: 'ping',
    alias: [],
    userPermissions: [],
    botPermissions: [],
    run: async (message) => {
        return message.reply('pong');
    }
}