module.exports = {
    name: "play",
    run: async (client, guild) => {
        try {
            const ytdl = require('ytdl-core');
            const queue = await client.queue.get(guild.id);
            // console.log(queue.songs);
            if (queue.songs.length == 0) {
                guild.channels.cache.get(queue.voiceChannel).leave(); // si no hay mas música en la cola, desconectamos nuestro bot
                client.queue.delete(guild.id);
                return;
            }
            const dispatcher = await queue.connection.play(ytdl(queue.songs[0].url)).on("finish",async () => {
                if(queue.loop == 1) {
                    client.emit('play', guild);
                } else if (queue.loop == 2) {
                    const actualQueue = client.queue.get(guild.id);
                    const lastSong = actualQueue.songs.shift();
                    actualQueue.songs.push(lastSong);
                    client.queue.set(guild.id, actualQueue);
                    client.emit('play', guild);
                } else {
                    const actualQueue = client.queue.get(guild.id);
                    actualQueue.songs.shift();
                    client.queue.set(guild.id, actualQueue);
                    client.emit('play', guild);
                }
            });
            guild.channels.cache.get(queue.textChannel).send(`Reproduciendo **${queue.songs[0].title}** por: ${queue.songs[0].author}`);
            dispatcher.setVolume(queue.volume / 100);
        } catch (error) {
            throw error;
        }
    }
}