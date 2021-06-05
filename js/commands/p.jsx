const  { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'p',
    botPermissions: [],
    alias: [],
    run: async (client, message, args) => {
        const embed = new MessageEmbed();
        const commands = require('../../src/commands.json').Entretenimiento;
        embed.setTimestamp();
        embed.setTitle('Lista de comandos de N Ξ O | Bot')
        embed.setDescription('**Categoria de Diversión**');
        for (const command in commands) {
            let cmd = commands[command];
            embed.addField(command, `*${cmd.description}*${cmd.alias.length>0?`\nAlias: \`${cmd.alias.join('` `')}\``:""}\nUso: \`${cmd.use}\``, true);
        }
        embed.setFooter(`${client.user.username} ${require('../../package.json').version}`, client.user.displayAvatarURL())
        embed.setThumbnail(client.user.displayAvatarURL())
        embed.setColor('RANDOM')
        client.api.channels(message.channel.id).messages.post({ 
            data: {
                content: 'Un poco de texto explicando el autorol',
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                style: 1,
                                label: 'Programación',
                                custom_id: 'help_entretenimiento',
                                type: 2
                            },
                            {
                                style: 1,
                                label: 'Entretenimiento',
                                custom_id: 'help_ayuda',
                                type: 2
                            }
                        ]
                    }
                ]
            }
        });
    }
}
