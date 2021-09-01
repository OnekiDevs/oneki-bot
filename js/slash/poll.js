const { MessageEmbed, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {create} = require("tar");

module.exports = {
    name: 'poll',
    data: ({guild, client}) => {
        return new Promise(resolve => {
            resolve((new SlashCommandBuilder()
                .setName('poll')
                .setDescription('create a poll')
                .addSubcommand(subcommand => subcommand
                    .setName('create')
                    .setDescription('create a poll')
                    .addChannelOption(option => option
                        .setName('channel')
                        .setDescription('channel where it will be posted'))))
                .toJSON())
        })
    },
    servers: ['825936007449935903'],
    /**
     * Execute the slash command
     * @param client: DiscordClient
     * @param interact: DiscordInteraction
     * @returns {Promise<void>}
     */
    run: async (client, interact) => {
        // console.log(interact)
        console.log(interact.options)
        
        if(interact.options.getSubcommand() == 'create') {
            console.log(interact.options.getChannel('channel'))
        }
        // let opciones = [];
        // const channelid = interact.data.options.find(i => i.name=='channel')?.value;
        // const context = interact.data.options.find(i => i.name=='context')?.value;
        // const guild = await client.guilds.cache.get(interact.guild_id);
        // const member = await guild.members.fetch(interact.member.user.id);
        // const channel = client.channels.cache.get(channelid??interact.channel_id);
        // const permissions = new Permissions(channel.permissionsFor(member));
        // if(!permissions.has('SEND_MESSAGES')) {
        //     return client.api.interactions(interact.id, interact.token).callback.post({
        //         data: {
        //             type: 4,
        //             data: {
        //                 content: 'You do not have permissions to send messages on that channel',
        //                 flags: 1 << 6
        //             }
        //         }
        //     });
        // }
        // for (const opcion of interact.data.options) {
        //     if ((/opcion\d{1,2}/g).test(opcion.name)) opciones.push(opcion.value);
        // }
        // const reacciones = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹'];
        // const embed = new MessageEmbed();
        // embed.setAuthor(member.displayName, member.user.displayAvatarURL());
        // embed.setDescription(context);
        // embed.setFooter(`${client.user.username} BOT ${require('../../package.json').version}`, client.user.avatarURL());
        // embed.setColor('RANDOM');
        // if (opciones.length == 0) opciones.push('Yes', 'No');
        // for (const opcion of opciones.slice(0, 19)) embed.addField(`Option ${reacciones[opciones.indexOf(opcion)]}`, opcion);
        // client.api.interactions(interact.id, interact.token).callback.post({
        //     data: {
        //         type: 4,
        //         data: {
        //             content: 'Sending poll',
        //             flags: 1 << 6
        //         }
        //     }
        // });
        // const msg = await channel.send(embed);
        // for (const opcion of opciones.slice(0, 19)) {
        //     msg.react(`${reacciones[opciones.indexOf(opcion)]}`);
        //     await client.util.sleep(500);
        // }
    }
}