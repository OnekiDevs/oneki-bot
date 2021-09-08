const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } = require('discord.js');
const fetch = require('node-fetch');
module.exports.run = async (client, interact, { category:c, lang:lng }) => {
    const server = client.servers.get(interact.guildId);
    fetch(`https://oneki.herokuapp.com/api/lang/${server.lang}/cmd/categories`).then((r) => r.json()).then((categories) => {
        fetch(`https://oneki.herokuapp.com/api/lang/${lng}/cmd/${c}`).then((r) => r.json()).then(async category=>{
            const lang = client.util.lang({lang:server.lang, route:'commands/help'}), 
                embed = new MessageEmbed().setTitle(`${await client.util.replace(lang.embed.title, [{match:"{bot}", replace:interact.guild.me.displayName}])}`).setDescription(`${await client.util.replace(lang.embed.description, [{match:"{type}", replace:c}])}`).setColor('#f89dfa');
                let j = 0, k = 0, buttons = [];
            for (const i of category) embed.addField(i.name, `${await client.util.replace(lang.command, [
                    {match:"{alias}", replace:i.alias.length>0?`\`${i.alias.join('` `')}\``:lang.none},
                    {match:"{description}", replace:i.description},
                    {match:"{prefix}", replace:i.type=='slash'?'/':server.prefix},
                    {match:"{use}", replace:i.use}
                ])}`, true);
            for (const i of categories) {
                const btn = new MessageButton().setStyle(i==c?'SUCCESS':'PRIMARY').setLabel(i).setCustomId(`help_${server.lang}_${i}`)
                if(j==0) buttons.push(new MessageActionRow().addComponents([btn])) 
                else buttons[k].addComponents([btn])
                if (j==4) {
                    j=0
                    k++
                } else j++
            }
            interact.message.edit({
                embeds: [embed],
                components: buttons
            });
        });
    });
    interact.deferUpdate();
}
module.exports.id = 'help';

// const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } = require('discord.js');
// const fetch = require('node-fetch');
// module.exports.run = async (client, interact, { category:c, lang:lng }) => {
//     const server = client.servers.get(interact.guildId);
//     // fetch(`https://oneki.herokuapp.com/api/${server.lang}/cmd/categories`).then((r) => r.json()).then((categories) => {
//         fetch(`https://oneki.herokuapp.com/api/${lng}/cmd/`).then((r) => r.json()).then(async commands=>{
//             const lang = client.util.lang({lang:server.lang, route:'commands/help'}), 
//                 embed = new MessageEmbed().setTitle(`${await client.util.replace(lang.embed.title, [{match:"{bot}", replace:interact.guild.me.displayName}])}`).setDescription(`${await client.util.replace(lang.embed.description, [{match:"{type}", replace:c}])}`).setColor('#f89dfa'), 
//                 categories = commands.map(c=>c.category).filter((e,i,a)=>a.indexOf(e)==i)
//                 let j = 0, k = 0, buttons = [];
//             for (const i of categories) {
//                 embed.addField(i, commands.filter(c => c.category==i).map(c => c.name).join(', '), true);
//                 const btn = new MessageButton().setStyle(i==c?'SUCCESS':'DANGER').setLabel(i).setCustomId(`help_${server.lang}_${i}`)
//                 if(j==0) buttons.push(new MessageActionRow().addComponents([btn])) 
//                 else buttons[k].addComponents([btn])
//                 if (j==4) {
//                     j=0
//                     k++
//                 } else j++
//             }
//             interact.message.edit({
//                 embeds: [embed],
//                 components: buttons
//             });
//         });
//     // });
//     interact.deferUpdate();
// }
// module.exports.id = 'help';