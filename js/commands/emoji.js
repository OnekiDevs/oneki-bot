module.exports = {
    name: 'emoji',
    alias: ['emote'],
    userPermissions: [],
    botPermissions: [],
    run: async (client, message, args) => {
        if (args[0].startsWith("<:") || args[0].startsWith("<a:") && args != undefined) {
            let emojiId = args[0].substring(
                args[0].lastIndexOf(':') + 1,
                args[0].lastIndexOf('>'),
            );   
            console.log(emojiId, "e");
            if (args[0].includes("<a:")) {
                return message.reply(`https://cdn.discordapp.com/emojis/${emojiId}.gif?v=1`)
            } else {
                return message.reply(`https://cdn.discordapp.com/emojis/${emojiId}.png?size=64`)
            }
        }
        if (args[0].match(/\d/g)) {
            return message.reply(`https://cdn.discordapp.com/emojis/${args[0]}.png?size=64`)
        }
        return message.reply('Emoji no encontrado, asegurate que sea un Emoji o una ID de un emoji **no animado** de cualquier servidor (No pegatinas ni Emojis predeterminados, e.g "👍")')
    }
}