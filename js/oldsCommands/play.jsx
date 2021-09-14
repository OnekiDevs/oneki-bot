const search = require("youtube-search");
module.exports = {
    name: "play",
    botPermissions: [],
    alias: ["p"],
    userPermissions: [],
    bot: true,
    category: "s",
    description: "Reproduce musica en un canal de voz",
    use: ".play [name]",
    example: ".Ping",
    run: async (message, args) => {
        return;
        if (!args[0]) return message.reply('Nesesita ingresar una busqueda o link de youtube');
        const Query = (await search(args.join(" "), {
            maxResults: 1,
            key: process.env.TOKEN_GOOGLE,
            type: "video",
        })).results[0];
        // console.log(Query);
        // if (!Query) return message.inlineReply('Lo siento pero solo puedo reproducir links de youtube');
        const conected = await client.util.joinVoice(message);
        console.log(conected);
        if (!conected) return;
        const song = {
            title: Query.title,
            url: Query.link,
            author: message.author.tag,
        };
        let queue = await client.queue.get(message.guild.id);
        if (!queue) {
            client.queue.set(message.guild.id,  {
                textChannel: message.channel.id, //guardamos el canal de texto
                voiceChannel: message.guild.me.voice.channel.id, // guardamos el canal de voz
                connection: conected, // un objeto para la conexión
                songs: [song], // creamos la lista de canciones
                volume: 100, // volumen al iniciar la cola
                playing: true, // un objeto para validar la cola de música en reproducción.
                loop: 0
            });
            client.emit('play', message.guild);
            conected.on('disconnect', () => {
                client.queue.delete(message.guild.id);
            });
        } else {
            queue.songs.push(song);
            queue.textChannel = message.channel.id;
            client.queue.set(message.guild.id, queue);
        }
        message.reply(`**${song.title}** ha sido añadido a la cola!`);
    }
};