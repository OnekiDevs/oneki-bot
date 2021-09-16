const { MessageButton, MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
    name: 'help',
    botPermissions: [],
    userPermissions: [],
    alias: ['commands'],
    run: async (client, message, args) => {
        message.channel.sendTyping();
        const server = client.servers.get(message.guild.id);
        fetch(`https://oneki.herokuapp.com/api/lang/${server.lang}/cmd/categories`).then(async r => {
            const body = await r.text();
            console.log(body)
            try {
                return JSON.parse(body);
            } catch (err) {
                console.error("Error:", err);
                console.error("Response body:", body);
                // throw err;
                return {
                    categories: []
                }
            }
        }).then((categories) => {
            categories = categories.categories;
            console.log(categories)
            fetch(`https://oneki.herokuapp.com/api/lang/${server.lang}/cmd/${categories[0]}`).then(async (r) => {
                const body = await r.text();
                console.log(body)
                try {
                    return JSON.parse(body);
                } catch (err) {
                    console.error("Error:", err);
                    console.error("Response body:", body);
                    // throw err;
                    return []
                }
            }).then(async category=>{
                console.log(category)
                const lang = client.util.lang({lang:server.lang, route:'commands/help'}),
                    embed = new MessageEmbed().setTitle(`${await client.util.replace(lang.embed.title, [{match:"{bot}", replace:message.guild.me.displayName}])}`).setDescription(`${await client.util.replace(lang.embed.description, [{match:"{type}", replace:categories[0]}])}`).setColor('#f89dfa');
                let j = 0, k = 0, buttons = [];
                for (const i of category) embed.addField(i.name, `${await client.util.replace(lang.command, [
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