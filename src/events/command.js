module.exports = {
    name: 'command',
    run: async (client, command, message, args) => {
        if(!message.guild.me.hasPermission('SEND_MESSAGES'))return;
        const cmd = client.commands.find((c) => c.name.toLowerCase() == command || c.alias.includes(command));
        if (cmd) {
            cmd.run(client, message, args);
        }
    }
}