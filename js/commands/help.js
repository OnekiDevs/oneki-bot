const  { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'help',
    botPermissions: [],
    alias: [],
    run: async (client, message, args) => {
        const embed = new MessageEmbed();
        const commands = require('../../src/commands.json').Diversion;
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
                embed: embed,
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                style: 1,
                                label: 'Diversión',
                                custom_id: 'help_diversion',
                                type: 2
                            }
                        ]
                    }
                ]
            }
        });
    }
}