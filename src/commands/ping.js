module.exports = {
    name: 'ping',
    alias: [],
    run: async (client, message, args) => {
        return message.inlineReply('pong');
    }
}