const  { MessageEmbed } = require('discord.js')
module.exports = (client, commands, type, guildId) => {
    return new Promise(async (resolve, reject) => {
        const server = client.servers.get(guildId);
        const lang = client.util.lang({lang:server.lang, route:'commands/help/help'});
        // console.log(server);
        const embed = new MessageEmbed();
        embed.setTimestamp();
        embed.setTitle(`${await client.util.replace(lang.embed.title, [{match:"{bot}",replace:client.user.name}])}`)
        embed.setDescription(`${await client.util.replace(lang.embed.description, [{match:"{type}",replace:type}])}`);
        for (const command in commands) {
            let cmd = commands[command];
            embed.addField(command, `*${cmd[server.lang].description}*${cmd[server.lang].alias?.length>0?`\n${lang.alias}: \`${cmd[server.lang].alias.join('` `')}\``:""}\n${lang.use}: \`${cmd.type=='slash'?'/':client.servers.get(guildId).prefix}${cmd[server.lang].use}\``, true);
        }
        embed.setFooter(`${client.user.username} ${require('../../package.json').version}`, client.user.displayAvatarURL());
        embed.setThumbnail(client.user.displayAvatarURL())
        embed.setColor('RANDOM');
        resolve(embed);
    })
}