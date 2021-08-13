const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');
const fetch = require('node-fetch');
module.exports.run = async (client, interact, params) => {
    const server = client.servers.get(interact.guildId);
    fetch(`https://oneki.herokuapp.com/api/${server.lang}/cmd/categories`).then((r) => r.json()).then((categories) => {
        fetch(`https://oneki.herokuapp.com/api/${server.lang}/cmd/${interact.values[0]}`).then((r) => r.json()).then(async category=>{
            const lang = client.util.lang({lang:server.lang, route:'commands/help'}), 
                embed = new MessageEmbed().setTitle(`${await client.util.replace(lang.embed.title, [{match:"{bot}", replace:interact.guild.me.displayName}])}`).setDescription(`${await client.util.replace(lang.embed.description, [{match:"{type}", replace:interact.values[0]}])}`), 
                menu = new MessageSelectMenu().setCustomId('help').setPlaceholder(lang.menu.placeholder)
            for (const i of category) embed.addField(i.name, `${await client.util.replace(lang.command, [
                    {match:"{alias}", replace:i.alias.length>0?`\`${i.alias.join('` `')}\``:lang.none},
                    {match:"{description}", replace:i.description},
                    {match:"{prefix}", replace:server.prefix},
                    {match:"{use}", replace:i.use}
                ])}`, true);
            for (const i of categories) menu.addOptions({label:`${await client.util.replace(lang.menu.option, [{match:"{category}", replace:i}])}`,value:i});
            interact.message.edit({
                embeds: [embed],
                components: [new MessageActionRow().addComponents([menu])]
            });
        });
    });
    interact.deferUpdate();
}
module.exports.id = 'help';