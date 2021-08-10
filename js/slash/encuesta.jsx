const { MessageEmbed, Permissions } = require('discord.js');
module.exports = {
    name: 'encuesta',
    data: ({guild, client}) => {
        return {
            name: "poll",
            description: "create a poll",
            options: [
                {
                    name: 'context',
                    description: 'Survey context',
                    type: 3,
                    required: true,
                },
                {
                    name: 'channel',
                    description:'Channel where the survey will be launched',
                    type: 7
                },
                {
                    name: 'option1',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option2',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option3',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option4',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option5',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option6',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option7',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option8',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option9',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option10',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option11',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option12',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option13',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option14',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option15',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option16',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option17',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option18',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option19',
                    description: 'Option to choose for users',
                    type: 3,
                },
                {
                    name: 'option20',
                    description: 'Option to choose for users',
                    type: 3,
                }
            ]
        }
    },
    servers: [],
    run: async (client, interact) => {
        let opciones = [];
        const channelid = interact.data.options.find(i => i.name=='channel')?.value;
        const context = interact.data.options.find(i => i.name=='context')?.value;
        const guild = await client.guilds.cache.get(interact.guild_id);
        const member = await guild.members.fetch(interact.member.user.id);
        const channel = client.channels.cache.get(channelid??interact.channel_id);
        const permissions = new Permissions(channel.permissionsFor(member));
        if(!permissions.has('SEND_MESSAGES')) {
            return client.api.interactions(interact.id, interact.token).callback.post({
                data: {
                    type: 4, 
                    data: {
                        content: 'You do not have permissions to send messages on that channel',
                        flags: 1 << 6
                    }
                }
            });
        }
        for (const opcion of interact.data.options) {
            if ((/opcion\d{1,2}/g).test(opcion.name)) opciones.push(opcion.value);
        }
        const reacciones = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹'];
        const embed = new MessageEmbed();
        embed.setAuthor(member.displayName, member.user.displayAvatarURL());
        embed.setDescription(context);
        embed.setFooter(`${client.user.username} BOT ${require('../../package.json').version}`, client.user.avatarURL());
        embed.setColor('RANDOM');
        if (opciones.length == 0) opciones.push('Yes', 'No');
        for (const opcion of opciones.slice(0, 19)) embed.addField(`Option ${reacciones[opciones.indexOf(opcion)]}`, opcion);
        client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 4, 
                data: {
                    content: 'Sending poll',
                    flags: 1 << 6
                }
            }
        });
        const msg = await channel.send(embed);
        for (const opcion of opciones.slice(0, 19)) {
            msg.react(`${reacciones[opciones.indexOf(opcion)]}`);
            await client.util.sleep(500);
        }
    }
}


