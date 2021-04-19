module.exports = {
    name: 'message',
    run: async (client, message) => {
        if (message.channel.type == 'dm') client.emit('directMessage', message)
    }
}