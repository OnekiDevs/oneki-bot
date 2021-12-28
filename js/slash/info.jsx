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
            const member = interact.options.getMember('member')??interact.member;
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
            if(member.nickname) embed.addField('Nickname', member.nickname, true)
            embed
                .addField('Color de Miembro', `${member.displayColor} / ${member.displayHexColor}`, true)
            if(member.user.accentColor) embed.addField('Color de Usuario', `${member.user.accentColor} / ${member.user.hexAccentColor}`, true)
            embed
                .addField('Fecha de creación', `<t:${Math.round(member.user.createdTimestamp/1000)}:d> <t:${Math.round(member.user.createdTimestamp/1000)}:R>`, true)
                .addField('Entro el', `<t:${Math.round(member.joinedTimestamp/1000)}:d> <t:${Math.round(member.joinedTimestamp/1000)}:R>`, true)
                .setColor(member.displayColor)
                .setThumbnail(member.displayAvatarURL({size:512}))
            if(member.user.banner) embed.setImage(member.user.bannerURL({dynamic:true, size:2048}))
            if(member.premiumSinceTimestamp) embed.addField('Boosteando desde', `<t:${Math.round(member.premiumSinceTimestamp/1000)}:R>`, true)
            embed.addField('Roles', member.roles.cache.map(r=>`${r}`).join(' '))
            let embeds = [embed, new MessageEmbed().setTitle('Avatar').setURL(member.user.displayAvatarURL({dynamic:true,size:2048})).setImage(member.user.displayAvatarURL({dynamic:true,size:2048})).setColor(member.user.accentColor??member.displayColor)]
            if (member.avatar) embeds.push(new MessageEmbed().setTitle('Avatar en Server').setURL(member.avatarURL({dynamic:true,size:2048})).setImage(member.avatarURL({dynamic:true,size:2048})).setColor(member.user.accentColor??member.displayColor))
            interact.editReply({
                embeds: embeds
            })
        }
    }
}