'use strict';
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'info',
    data: () => {
        return new Promise(resolve => {
            resolve((new SlashCommandBuilder()
                .setName('info')
                .setDescription('get info')
                .addSubcommand(subcommand => subcommand
                    .setName('member')
                    .setDescription('get member info')
                    .addUserOption(option => option
                        .setName('member')
                        .setDescription('member')
                        .setRequired(false))))
                .toJSON())
        })
    },
    servers: [],
    /**
     * Execute the slash command
     * @param interact: DiscordInteraction
     * @returns {Promise<void>}
     */
    run: async (interact) => {
        interact.deferReply()
        await util.sleep()
        if(interact.options.getSubcommand() === 'member') {
            const member = interact.options.getMember('member')??interact.member
            const fetcmember = await (await fetch(`http://discord.com/api/v9/guilds/${member.guild.id}/members/${member.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bot ${TOKEN}`
                }
            })).json()
            const fetcuser = await (await fetch(`http://discord.com/api/v9/users/${member.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bot ${TOKEN}`
                }
            })).json()
            console.log(fetcuser)
            const embed = new MessageEmbed()
                .setTitle(`${member.displayName} info`)
                .setDescription(`${member.user.bot?`Es Bot${member.user.flags.has('VERIFIED_BOT')?' verificado':''}`:''}
                ${member.pending?'Miembro pendiente de verificación':''}
                ${member.user.flags.has('HOUSE_BALANCE')?'House Balance':''}
                ${member.user.flags.has('HOUSE_BRILLIANCE')?'House Brilliance':''}
                ${member.user.flags.has('HOUSE_BRAVERY')?'House Bravery':''}
                ${member.user.flags.has('DISCORD_EMPLOYEE')?'Empleado de Discord':''}
                ${member.user.flags.has('DISCORD_CERTIFIED_MODERATOR')?'Moderador Certificado de Discord':''}
                ${member.user.flags.has('HYPESQUAD_EVENTS')?'Eventos de HypeSquad':''}
                ${member.user.flags.has('BUGHUNTER_LEVEL_1')?'Cazador de Bugs Nivel 1':''}
                ${member.user.flags.has('BUGHUNTER_LEVEL_2')?'Cazador de Bugs Nivel 2':''}
                ${member.user.flags.has('EARLY_VERIFIED_BOT_DEVELOPER')?'Desarrollador de Bots Verificado':''}`)
                .addField('ID', member.id, true)
                .addField('Tag', member.user.tag, true)
                .addField('Color', `${member.displayColor} / ${member.displayHexColor}`, true)
                .addField('Fecha  de creación', `<t:${member.user.createdTimestamp}:d>`, true)
                .addField('Entro el', `<t:${member.joinedTimestamp}:d> <t:${member.joinedTimestamp}:R>`, true)
                .setColor(member.displayColor)
                .setThumbnail(fetcmember.avatar?`https://cdn.discordapp.com/guilds/${member.guild.id}/users/${member.id}/avatars/${fetcmember.avatar}.png?size=512`:member.user.displayAvatarURL({size:512}))
                .setImage(fetcuser.banner?`https://cdn.discordapp.com/banners/${member.id}/${fetcuser.banner}.${fetcuser.banner.startsWith('a_')?'gif':'png'}?size=1024`:'')
            if(member.premiumSinceTimestamp) embed.addField('Boosteando desde hace', `<t:${member.premiumSinceTimestamp}:R>`, true)
            if(member.user)
            embed.addField('Roles', member.roles.cache.map(r=>`${r}`).join(' '))
            let embeds = [embed, new MessageEmbed().setTitle('Avatar').setURL(member.user.displayAvatarURL({dynamic:true,size:2048})).setImage(member.user.displayAvatarURL({dynamic:true,size:1024})).setColor(member.displayColor)]
            if (fetcmember.avatar) embeds.push(new MessageEmbed().setTitle('Avatar en server').setURL(`https://cdn.discordapp.com/guilds/${member.guild.id}/users/${member.id}/avatars/${fetcmember.avatar}.${fetcmember.avatar.startsWith('a_')?'gif':'png'}?size=2048`).setImage(`https://cdn.discordapp.com/guilds/${member.guild.id}/users/${member.id}/avatars/${fetcmember.avatar}.${fetcmember.avatar.startsWith('a_')?'gif':'png'}?size=1024`).setColor(member.displayColor))
            interact.editReply({
                embeds: embeds
            })
        }
    }
}