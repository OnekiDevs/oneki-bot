module.exports = {
    name: 'ping',
    alias: [],
    botPermissions: [],
    run: async (client, message, args) => {
        return message.inlineReply('pong');
    }
}