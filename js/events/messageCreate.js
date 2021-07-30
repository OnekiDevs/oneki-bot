module.exports = {
    name: 'messageCreate',
    run: async (client, message) => {
        if (message.author.bot) return;
        if (message.channel.type == 'dm') return client.emit('directMessage', message);
        const prefix = client.servers.get(message.guild.id)?.prefix;
        if (!message.content.toLowerCase().startsWith(prefix)) return;
        args = message.content.slice(prefix.length).trim().split(/ +/g);
        return client.emit('command', args.shift().toLowerCase(), message, args);
    }
}