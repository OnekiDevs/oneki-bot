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
                    .addChannelOption(option => option.setName('channel').setDescription('channel where it will be posted'))))
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
        interact.deferReply()
        if(interact.options.getSubcommand() === 'create') {
            const id = generate()
            const options = interact.options._hoistedOptions.filter(o=>(/option_\d{1,2}/).test(o.name)).map(o=>new Option({...o,pollId:id}))
            const channel = interact.options.getChannel('channel')
            let buttons = []
            const embed = new MessageEmbed()
                .setAuthor(interact.member.displayName, interact.user.displayAvatarURL())
                .setTitle(interact.options.getString('title')??'New Poll')
                .setDescription(interact.options.getString('context'))
            // console.log(options)
            if(options.length>1) {
                embed.addFields(options.map(o=>o.toField()))
                let i = 1, j = 0;
                buttons.push(new MessageActionRow())
                for (const option of options) {
                    console.log(i, option, j)
                    if(i%5===0){
                        buttons.push(new MessageActionRow())
                        buttons[j++].addComponents([option.toButton()])
                    } else {
                        buttons[j].addComponents([option.toButton()])
                    }
                    i++
                }
                console.log(buttons)
            } else {

            }
            await client.util.sleep(3000)
            await interact.editReply({
                content: 'sending poll...'
            })
            const m = await (channel??interact.channel).send({
                embeds: [embed],
                components: buttons
            });
            console.log({
                id,
                options: options,
                message: m.id,
                channel: m.channel.id,
                guild: m.guild.id
            })
            await fetch('http://localhost:3000/api/poll',{
                method: 'POST',
                body: JSON.stringify({
                    id,
                    options: options,
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