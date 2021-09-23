module.exports = {
    name: "command",
    run: async (command, message, args) => {
        const server = client.servers.get(message.guild.id);
        if (server.blacklist.channels.includes(message.channel.id)) return;
        const cmd = client.commands.find(c=>c.checkCommand(command));
        if (cmd) cmd.checkMemberPermissions(message.member).then(()=>{
            cmd.checkBotPermissions(message.guild.me).then(()=>{
                try {
                    cmd.run(message, args)
                } catch (error) {
                    util.error(error, __dirname)
                }
            }).catch(msg=>message.reply(msg))
        }).catch(msg=>message.reply(msg))
    }
}
