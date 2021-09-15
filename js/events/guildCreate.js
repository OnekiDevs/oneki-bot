const { MessageEmbed } = require("discord.js");
const fs = require("fs");
module.exports = {
    name: "guildCreate",
    run: async (guild) => {
        try {
            let canal = client.channels.cache.get("867248825777127445");
            const embed = new MessageEmbed()
                .setThumbnail(guild.iconURL())
                .setTitle("Me añadieron en un Nuevo Servidor")
                .setDescription(`ahora estoy en ${client.guilds.cache.size} servidores`)
                .addField("Servidor", `${guild.name}`, true)
                .addField("ID", `${guild.id}`, true)
                // .addField("Region", guild.region, true)
                .addField("Roles", `${guild.roles.cache.size}`, true)
                .addField("Miembros", `${guild.memberCount}`, true)
                .addField("Dueño", `${(await client.users.fetch(guild.ownerId)).username}#${(await client.users.fetch(guild.ownerId)).discriminator}`, true)
                .setTimestamp()
                .setColor("RANDOM")
                .setFooter(`${client.user.username} Bot ${require('../../package.json').version}`)
                .setImage(guild.bannerURL());
            canal.send({
                embeds: [embed]
            });

            client.slash.map(async slash=>{
                if ((slash.servers[0] && slash.servers.includes(guild.id)) || !slash.servers[0]) guild.commands.create(await slash.data({guild: guild.id})).then((command) => console.log(command.name, '|', guild.name)).catch(err => console.log(guild.name, 'error',));
            })
        } catch (e) {
            util.error(e, __dirname)
        }
    }
}