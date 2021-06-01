module.exports = {
    name: 'command',
    run: async (client, command, message, args) => {
        try {
            if(!message.guild.me.hasPermission('SEND_MESSAGES'))return;
            const cmd = client.commands.find((c) => c.name.toLowerCase() == command || c.alias.includes(command));
            if (cmd) {
                if (!message.guild.me.hasPermission(cmd.botPermissions) && cmd.botPermissions.length > 0) return message.inlineReply(`No cuento con permisos suficientes, nesesito: \`${cmd.botPermissions.join('` `')}\``);
                cmd.run(client, message, args);
            }
        } catch (error) {
            client.emit('error', client, error, `Channel: <#${message.channel.id}>\nServer: ${message.guild.name} / ${message.guild.id}\nMessage: ${message.content}`)
        }
    }
}