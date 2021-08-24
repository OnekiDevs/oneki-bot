const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "guildCreate",
    run: async (client, guild) => {
        let canal = client.channels.cache.get("867248825777127445");
        const embed = new MessageEmbed()
            .setThumbnail(guild.iconURL)
            .setTitle("Me añadieron en un Nuevo Servidor")
            .setDescription(`ahora estoy en ${client.guilds.cache.size} servidores`)
            .addField("Servidor", guild.name, true)
            .addField("ID", guild.id, true)
            .addField("Region", guild.region, true)
            .addField("Roles", guild.roles.cache.size, true)
            .addField("Miembros", guild.memberCount, true)
            .addField("Dueño", `${guild.owner.user.username}#${guild.owner.user.discriminator}`, true)
            .setTimestamp()
            .setColor("RANDOM")
            .setFooter(`${client.user.username} Bot ${require('../../package.json').version}`)
            .setImage(guild.bannerURL());
        canal.send({
            embeds: [embed]
        });
    }
}