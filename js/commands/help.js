const  { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'help',
    botPermissions: [],
    usersPermissions: [],
    alias: [],
    run: async (client, message, args) => {
        const embed = new MessageEmbed();
        const commands = require('../../src/commands.json').Entretenimiento;
        embed.setTimestamp();
        embed.setTitle(`Lista de comandos de ${client.user.username} Bot`)
        embed.setDescription('**Categoria de Entretenimiento**\n`<>` significa opcional\n`[]` significa obligatorio');
        for (const command in commands) {
            let cmd = commands[command];
            embed.addField(command, `*${cmd.description}*${cmd.alias.length>0?`\nAlias: \`${cmd.alias.join('` `')}\``:""}${cmd.type=='command'?'\nUso: `n!'+cmd.use+'`':''}`, true);
        }
        embed.setFooter(`${client.user.username} ${require('../../package.json').version}`, client.user.displayAvatarURL())
        embed.setThumbnail(client.user.displayAvatarURL())
        embed.setColor('RANDOM')
        client.api.channels(message.channel.id).messages.post({ 
            data: {
                embed: embed,
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                style: 1,
                                label: 'Entretenimiento',
                                custom_id: 'help_entretenimiento',
                                type: 2
                            },
                            {
                                style: 1,
                                label: 'Ayuda',
                                custom_id: 'help_ayuda',
                                type: 2
                            },
                            {
                                style: 1,
                                label: 'Moderación',
                                custom_id: 'help_moderacion',
                                type: 2
                            },
                            {
                                style: 1,
                                label: 'Extra',
                                custom_id: 'help_extra',
                                type: 2
                            }
                        ]
                    }
                ]
            }
        });
    }
}