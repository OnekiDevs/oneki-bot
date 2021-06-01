module.exports = {
    name: "avatar",
    alias: [],
    botPermissions: [],
    run: async (client, message, args) => {
        const package = require('../../package.json')
        //Obtenemos el usuario
        let user = message.mentions.users.first()??client.users.cache.get(args[0])??message.author;
        //Se crea un embed
        const embed = new MessageEmbed()
            .setImage(user.displayAvatarURL({
                dynamic: true, 
                size: 512
            })) // El avatar
            .setTitle(`Avatar de ${user.username}`) // El titulo
            .setFooter(`${client.user.username} Bot ${package.version}`, client.user.avatarURL())
            .setFooter(`${client.user.username} ${package.version}`, client.user.avatarURL())
            .setTimestamp();
        message.inlineReply(embed);
    }
}