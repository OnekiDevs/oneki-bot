const fetch = require("node-fetch");
const {MessageEmbed, MessageButton, MessageActionRow} = require("discord.js");
module.exports = class Help extends require('../classes/OldCommand'){

    constructor() {
        super({
            name: 'help',
            aliases: ['ayuda', 'comandos', 'commands'],
            permissions: {
                bot: [],
                member: []
            },
            cooldown: 0,
            args: []
        })

    }

    run(message, args) {
        message.channel.sendTyping();
        const server = client.servers.get(message.guild.id);
        fetch(`https://oneki.herokuapp.com/api/lang/${server.lang}/cmd/categories`).then((r) => r.json()).then((categories) => {
            fetch(`https://oneki.herokuapp.com/api/lang/${server.lang}/cmd/${categories[0]}`).then((r) => r.json()).then(async category=>{
                const lang = util.lang({lang:server.lang, route:'commands/help'}),
                    embed = new MessageEmbed().setTitle(`${await util.replace(lang.embed.title, [{match:"{bot}", replace:message.guild.me.displayName}])}`).setDescription(`${await util.replace(lang.embed.description, [{match:"{type}", replace:categories[0]}])}`).setColor('#f89dfa');
                let j = 0, k = 0, buttons = [];
                for (const i of category) embed.addField(i.name, `${await util.replace(lang.command, [
                    {match:"{alias}", replace:i.alias.length>0?`\`${i.alias.join('` `')}\``:lang.none},
                    {match:"{description}", replace:i.description},
                    {match:"{prefix}", replace:i.type=='slash'?'/':server.prefix},
                    {match:"{use}", replace:i.use}
                ])}`, true);
                for (const i of categories) {
                    const btn = new MessageButton().setStyle(i==categories[0]?'SUCCESS':'PRIMARY').setLabel(i).setCustomId(`help_${server.lang}_${i}`)
                    if(j==0) buttons.push(new MessageActionRow().addComponents([btn]))
                    else buttons[k].addComponents([btn])
                    if (j==4) {
                        j=0
                        k++
                    } else j++
                }
                message.reply({
                    embeds: [embed],
                    components: buttons
                });
            })
        })
    }

}