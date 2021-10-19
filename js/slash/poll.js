// noinspection JSCheckFunctionSignatures

'use strict';
const { MessageEmbed, MessageButton, MessageActionRow} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {generate} = require('shortid');

class Option{constructor({name,type,value,pollId}){this.name=name;this.type=type;this.value=value;this.pollId=pollId}toString(){return this.value}toField(){return{name:`${this.name.replace('_',' ')}: ${this}`,value:`\`                         \` 0%`}}toButton(){return new MessageButton().setCustomId(`poll_${this.pollId}_${this.name}`).setLabel(`${this.name.replace('_',' ')}`).setStyle('PRIMARY')}}

module.exports = {
    name: 'poll',
    data: () => {
        return new Promise(resolve => {
            resolve((new SlashCommandBuilder()
                .setName('poll')
                .setDescription('create a poll')
                .addSubcommand(subcommand => subcommand
                    .setName('create')
                    .setDescription('create a poll')
                    .addStringOption(option => option
                        .setName('context')
                        .setDescription('context of the poll')
                        .setRequired(true))
                    .addStringOption(option => option
                        .setName('title')
                        .setDescription('title of the poll'))
                    .addStringOption(option => option.setName('option_1').setDescription('option 1'))
                    .addStringOption(option => option.setName('option_2').setDescription('option 2'))
                    .addStringOption(option => option.setName('option_3').setDescription('option 3'))
                    .addStringOption(option => option.setName('option_4').setDescription('option 4'))
                    .addStringOption(option => option.setName('option_5').setDescription('option 5'))
                    .addStringOption(option => option.setName('option_6').setDescription('option 6'))
                    .addStringOption(option => option.setName('option_7').setDescription('option 7'))
                    .addStringOption(option => option.setName('option_8').setDescription('option 8'))
                    .addStringOption(option => option.setName('option_9').setDescription('option 9'))
                    .addStringOption(option => option.setName('option_10').setDescription('option 10'))
                    .addChannelOption(option => option.setName('channel').setDescription('channel where it will be posted'))))
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
        if(interact.options.getSubcommand() === 'create') {
            const id = generate()
            let options = interact.options._hoistedOptions.filter(o=>(/option_\d{1,2}/).test(o.name)).map(o=>new Option({...o,pollId:id}))
            const channel = interact.options.getChannel('channel')
            let buttons = []
            const embed = new MessageEmbed()
                .setAuthor(interact.member.displayName, interact.user.displayAvatarURL())
                .setTitle(interact.options.getString('title')??'New Poll')
                .setDescription(interact.options.getString('context'))
            if(options.length>1) {
                embed.addFields(options.map(o=>o.toField()))
                let i = 1, j = 0;
                buttons.push(new MessageActionRow())
                for (const option of options) {
                    if(i%5===0){
                        buttons.push(new MessageActionRow())
                        buttons[j++].addComponents([option.toButton()])
                    } else buttons[j].addComponents([option.toButton()])
                    i++
                }
            } else {
                embed.addField(`option 1: yes`, `\`                         \` 0%`)
                embed.addField(`option 2: no`, `\`                         \` 0%`)
                buttons.push(new MessageActionRow().addComponents([new MessageButton().setCustomId(`poll_${id}_option_1`).setLabel(`option 1`).setStyle('PRIMARY'), new MessageButton().setCustomId(`poll_${id}_option_2`).setLabel(`option 2`).setStyle('PRIMARY')]))
                options = [{
                    name: 'option_1',
                    type: 'STRING',
                    value: 'yes',
                    pollId: id
                },
                {
                    name: 'option_2',
                    type: 'STRING',
                    value: 'no',
                    pollId: id
                }]
            }
            embed.setFooter(`Total votes: 0 | ${client.user.username} ${require('../../package.json').version}`, client.user.displayAvatarURL())
            await util.sleep(3000)
            await interact.editReply({
                content: 'sending poll...',
                ephemeral: true
            })
            const m = await (channel??interact.channel).send({
                embeds: [embed],
                components: buttons
            });
            console.log({
                id,
                options,
                message: m.id,
                channel: m.channel.id,
                guild: m.guild.id
            })
            await fetch('http://oneki.herokuapp.com/api/poll',{
                method: 'POST',
                body: JSON.stringify({
                    id,
                    options,
                    message: m.id,
                    channel: m.channel.id,
                    guild: m.guild.id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    }
}
