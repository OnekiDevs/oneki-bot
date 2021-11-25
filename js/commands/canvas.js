const {MessageEmbed} = require("discord.js");
const {MessageCanvas, Command} = require('../scripts/exportClasses')
module.exports = class Canvas extends Command{

    constructor() {
        super({
            name: 'canvas',
            aliases: [],
            permissions: {
                bot: [],
                member: []
            },
            cooldown: 0,
            args: []
        })

    }

    run(message, args) {
        switch (args.shift()) {
            case 'createCanvas':
                const messageCanvas = new MessageCanvas()
                message.reply({
                    embeds: [new MessageEmbed().title('nuevo canvas creado').setDescription(`editores ${'s'}`)]
                })
                break;
            default:
                message.reply('no reconozco ese comando')
        }
    }

}