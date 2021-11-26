module.exports = {
    name: 'new_yt_video',
    run: async (req) => {
        try {
            client.channels.cache.get('913615639938224129')?.send(`**${req.value.channel.name}** just uploaded a new video - **${req.value.video.link}**`)
        }  catch (e) {
            util.error(e, __filename)
        }
    }
}
