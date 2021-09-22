const {MessageButton, MessageActionRow} = require("discord.js");
module.exports = class Ping extends require('../classes/Command'){

    constructor() {
        super({
            name: 'clear',
            aliases: [],
            permissions: {
                bot: ['MANAGE_MESSAGES', 'MANAGE_CHANNELS'],
                member: ['MANAGE_MESSAGES', 'MANAGE_CHANNELS']
            },
            cooldown: 0,
            args: []
        })

    }

    async run(message, args) {
        const server = client.servers.get(message.guild.id);
        const lang = util.lang({lang:server.lang, route:'commands/clear'});
        if (!args[0] || args[0] != "-y"){
            message.reply({
                content:lang.sure,
                components: [new MessageActionRow().addComponents([
                    new MessageButton().setLabel(lang.buttons.yes).setStyle('PRIMARY').setCustomId('clear_yes'),
                    new MessageButton().setLabel(lang.buttons.no).setStyle('DANGER').setCustomId('clear_no')
                ])]
            });
        } else {
            const canal = await message.channel.clone();
            canal.setPosition(message.channel.position);
            message.channel.delete();
        }
    }

}