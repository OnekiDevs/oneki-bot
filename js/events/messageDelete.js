// const client = require('../bot');
const db = require('firebase-admin').firestore();
const package = require('../../package.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "messageDelete",
    run: async (client, message) => {
        try {
            if (!message.author || message.author?.bot) return;
            if (!message.content) return;
            const snapshot = await db.collection(message.guild.id).doc("deleted").get();
            const canal = client.channels.cache.get(snapshot.data()?.channel);
            if (!canal) return;
            const embed = new MessageEmbed()
                .setTitle("Mensaje eliminado")
                .setURL(message.url)
                .setColor("RANDOM")
                .addField("Autor del mensaje:", message.author.username, true)
                .addField("Eliminado En:", message.channel, true)
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .addField("Escrito el:", `${new Date(message.createdTimestamp).toDateString()}`, true)
                .addField("Contexto", `[ir alcontexto](${message.url})`, true)
                .addField("Contenido:", message.content)
                .setFooter(`Kone Bot ${package.version}`, client.user.avatarURL());
            canal.send({
                content: message.author.id,
                embeds: [embed]
            })
        } catch (error) {
            console.log(error);
            const channelError = await client.channels.cache.get('833780614712131616');
            channelError.send(`Error en **events/messageUpdate.js**\n${error} <@&832657759081463848>\nChannel: <#${message.channel.id}>\nServer: ${message.guild.name} / ${message.guild.id}${message.content}`);
        }
    }
}