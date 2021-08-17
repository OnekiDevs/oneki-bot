const { Permissions, MessageEmbed } = require('discord.js');
module.exports = {
    name: 'command',
    run: async (client, command, message, args) => {
        if(!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return;
        const cmd = client.commands.find((c) => c.name.toLowerCase() == command || c.alias.includes(command));
        if (cmd) {
            const server = client.servers.get(message.guild.id);
            const lang = client.util.lang({lang:server.lang, route:'events/command'});
            if (cmd.userPermissions?.length > 0 && !message.member.permissions.has(cmd.userPermissions)) return; 
            if (cmd.botPermissions?.length > 0 && !message.guild.me.permissions.has(cmd.botPermissions)) return message.reply(await client.util.replace(lang.botPermissions, [{match:"{permissions}", replace:`\`${new Permissions(cmd.botPermissions).toArray().join('` `')}\``}]));
            try {
                cmd.run(client, message, args);
            } catch (error) {
                console.log('\x1b[31m%s\x1b[0m', '**********************************************************************');
                console.error(error);
                console.log('\x1b[31m%s\x1b[0m', '**********************************************************************');
                client.channels.cache.get('833780614712131616').send({
                    embeds: [new MessageEmbed().setColor('YELLOW').setTitle('New Error Detected')]
                })
            }
        }
    }
}