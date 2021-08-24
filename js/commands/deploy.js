module.exports = {
    name: "deploy",
    botPermissions: [],
    userPermissions: [],
    alias: [],
    run(client, message, args) {
        if (['534614025271771158', '430015015588986880'].includes(message.user.id)) client.slash.filter(command => command.servers[0]).forEach(async slash => client.application.commands.create(await slash.data({guild: message.guild.id})))
    }
}