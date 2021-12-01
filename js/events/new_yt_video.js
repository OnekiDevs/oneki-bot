module.exports = {
    name: 'new_yt_video',
    run: async (req) => {
        try {
            client.channels.cache.get(client.servers.get(req.server).notifications[req.value.channel.id])?.send(`**${req.value.channel.name}** just uploaded a new video - **${req.value.video.link}**`)
        }  catch (e) {
            util.error(e, __filename)
        }
    }
}
