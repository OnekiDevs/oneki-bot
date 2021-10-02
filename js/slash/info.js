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
        interact.deferReply({
            ephemeral: true
        })
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
            // member.fetch()
            console.log(fetcuser);
            // const banner = (await member.user.fetch())
            // console.log(banner)
            const embed = new MessageEmbed()
                .setTitle(`${member.displayName} info`)
                .addField('ID', member.id, true)
                .addField('Tag', member.user.tag, true)
                .setThumbnail(fetcmember.avatar?`https://cdn.discordapp.com/guilds/${member.guild.id}/users/${member.id}/avatars/${fetcmember.avatar}.webp?size=1024`:member.user.displayAvatarURL())
                .setImage(fetcuser.banner?`https://cdn.discordapp.com/banners/${member.id}/${fetcuser.banner}.webp?size=1024`:'')

            interact.editReply({
                embeds: [embed]
            })
        }
    }
}