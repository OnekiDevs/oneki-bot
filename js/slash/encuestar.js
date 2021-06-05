const { MessageEmbed } = require('discord.js');
module.exports = {
    data: {
        name: "encuestar",
        description: "Has una encuesta",
        options: [
            {
                name: 'context',
                description: 'Contexto de la encuesta',
                type: 3,
                required: true,
            },
            {
                name: 'channel',
                description:'Canal donde se lanzará la encuesta',
                type: 7
            },
            {
                name: 'opcion1',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion2',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion3',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion4',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion5',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion6',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion7',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion8',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion9',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion10',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion11',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion12',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion13',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion14',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion15',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion16',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion17',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion18',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion19',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            },
            {
                name: 'opcion20',
                description: 'Opcion a elegir para los usuarios',
                type: 3,
            }
        ]
    },
    server: 'all',
    run: async (client, interact) => {
        //revisar si es admin
        let opciones = [];
        // console.log(interact.data.options);
        const channelid = interact.data.options.find(i => i.name=='cahnnel')?.value;
        const context = interact.data.options.find(i => i.name=='context')?.value;
        const guild = await client.guilds.cache.get(interact.guild_id);
        const member = await guild.members.cache.get(interact.member.user.id);
        for (const opcion of interact.data.options) {
            if ((/opcion\d{1,2}/g).test(opcion.name)) opciones.push(opcion.value);
        }
        const reacciones = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹'];
        const embed = new MessageEmbed();
        embed.setAuthor(member.nickname??member.user.username, member.user.displayAvatarURL());
        embed.setDescription(context);
        embed.setFooter(`${client.user.username} BOT ${package.version}`, client.user.avatarURL());
        embed.setColor('RANDOM');
        if (opciones.length > 0) {
            for (const opcion of opciones.slice(0, 19)) embed.addField(`Opcion ${reacciones[opciones.indexOf(opcion)]}`, opcion);
            const msg = await channel.send(embed);
            for (const opcion of opciones.slice(0, 19)) {
                msg.react(`${reacciones[opciones.indexOf(opcion)]}`);
                await sleep(500);
            }
        } else {
            embed.addField(`Opcion 🇦`, 'Si/Yes');
            embed.addField(`Opcion 🇧`, 'No');
            const msg = await channel.send(embed);
            msg.react(`🇦`);        
            msg.react(`🇧`);
        }  
        if (channelid) {
            const channel = client.channels.cache.get(channelid);
            channel.send(embed);
            client.api.interactions(interact.id, interact.token).callback.post({
                data: {
                    type: 4, 
                    data: {
                        content: 'Enviando encuesta',
                        flags: 1 << 6
                    }
                }
            });
        } else {
            client.api.interactions(interact.id, interact.token).callback.post({
                data: {
                    type: 4, 
                    data: {
                        embed: embed
                    }
                }
            });
        }
    }
}
//token WzcxMjA2MzcwNTUzNzQ0NTk0OCxmYWxzZV0.YHXQJg.c8KS2Zdk6K9ogYgOk0nBidbwanY


