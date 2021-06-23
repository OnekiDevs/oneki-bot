const { Permissions } = require('discord.js');
module.exports = {
    name: 'command',
    run: async (client, command, message, args) => {
        try {
            if(!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return;
            const cmd = client.commands.find((c) => c.name.toLowerCase() == command || c.alias.includes(command));

            if (cmd) {
                if (cmd.botPermissions?.length > 0 && !message.member.permissions.has(cmd.userPermissions)) return message.reply(`No cuentas con permisos suficientes, necesitas: \`${cmd.botPermissions.join('` `')}\``);
                if (cmd.botPermissions?.length > 0 && !message.guild.me.permissions.has(cmd.botPermissions)) return message.reply(`No cuento con permisos suficientes, necesito: \`${cmd.botPermissions.join('` `')}\``);
                cmd.run(client, message, args);
            }
        } catch (error) {
            client.emit('error', client, error, `Channel: <#${message.channel.id}>\nServer: ${message.guild.name} / ${message.guild.id}\nMessage: ${message.content}`)
        }
    }
}