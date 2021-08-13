const { Permissions } = require('discord.js');
module.exports = {
    name: 'command',
    run: async (client, command, message, args) => {
        if(!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return;
        const cmd = client.commands.find((c) => c.name.toLowerCase() == command || c.alias.includes(command));
        if (cmd) {
            const server = client.servers.get(message.guild.id);
            const lang = client.util.lang({lang:server.lang, route:'events/command'});
            if (cmd.userPermissions?.length > 0 && !message.member.permissions.has(cmd.userPermissions)) return message.reply(await client.util.replace(lang.userPermissions, [{match:"{permissions}", replace:`\`${new Permissions(cmd.userPermissions).toArray().join('` `')}\``}]));
            if (cmd.botPermissions?.length > 0 && !message.guild.me.permissions.has(cmd.botPermissions)) return message.reply(await client.util.replace(lang.botPermissions, [{match:"{permissions}", replace:`\`${new Permissions(cmd.botPermissions).toArray().join('` `')}\``}]));
            cmd.run(client, message, args);
        }
    }
}