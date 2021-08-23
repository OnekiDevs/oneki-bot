// const client = require('../bot');
const db = require('firebase-admin').firestore();
const package = require('../../package.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "messageUpdate",
    run: async (client, oldMessage, newMessage) => {
        return;
        try {
            if (!oldMessage.author || oldMessage.author?.bot) return;
            if (oldMessage.content === newMessage.content) return;
            const snapshot = await db.collection(oldMessage.guild.id).doc("edited").get();
            const canal = client.channels.cache.get(snapshot.data()?.channel);
            if (!canal) return;
            const embed = new MessageEmbed()
            embed.setTitle("Mensaje eliminado");
            embed.setURL(oldMessage.url);
            embed.setColor("RANDOM");
            embed.addField("Autor del mensaje:", oldMessage.author.username, true);
            embed.addField("Eliminado En:", `<#${oldMessage.channel.id}>`, true);
            embed.setTimestamp();
            embed.setThumbnail(oldMessage.author.displayAvatarURL({dynamic: true}));
            embed.addField("Escrito el:", `${new Date(oldMessage.createdTimestamp).toDateString()}`, true);
            embed.addField("Editado el:", `${new Date(newMessage.editedTimestamp).toDateString()}`, true);
            if (oldMessage.content) {
                embed.addField("Antes", oldMessage.content, true);
            }
            if (newMessage.content) {
                embed.addField("Despues", newMessage.content, true);
            }
            embed.setFooter(`Kone Bot ${package.version}`, client.user.avatarURL());
            canal.send({
                content: oldMessage.author.id,
                embeds: [embed]
            });
        } catch (error) {
            console.log(error);
            const channelError = await client.channels.cache.get('833780614712131616');
            channelError.send(`Error en **events/messageUpdate.js**\n${error} <@&832657759081463848>\nChannel: <#${oldMessage.channel.id}>\nServer: ${oldMessage.guild.name} / ${oldMessage.guild.id}${oldMessage.content}`);
        }
    }
}
