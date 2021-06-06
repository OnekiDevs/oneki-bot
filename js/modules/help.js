const  { MessageEmbed } = require('discord.js')
module.exports = (client, commands, type) => {
    return new Promise((resolve, reject) => {
        const embed = new MessageEmbed();
        embed.setTimestamp();
        embed.setTitle(`Lista de comandos de ${client.user.username} Bot`)
        embed.setDescription(`**Categoria ${type}**\n\`<>\` significa opcional\n\`[]\` significa obligatorio`);
        for (const command in commands) {
            let cmd = commands[command];
            embed.addField(command, `*${cmd.description}*${cmd.alias?.length>0?`\nAlias: \`${cmd.alias.join('` `')}\``:""}\nUso: \`${cmd.type=='slash'?'/':client.settings.prefix}${cmd.use}\``, true);
        }
        embed.setFooter(`${client.user.username} ${require('../../package.json').version}`, client.user.displayAvatarURL());
        embed.setThumbnail(client.user.displayAvatarURL())
        embed.setColor('RANDOM');
        resolve(embed);
    })
}