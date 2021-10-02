const util = require("util");
module.exports = {
    name: 'messageCreate',
    run: async (message) => {
        try {
            // console.log(message.channel.type);
            if (message.author.bot) return;
            if (message.channel.type == 'DM') return client.emit('directMessage', message);
            const prefix = client.servers.get(message.guild.id)?.prefix;
            if(message.channel.id == '893310001282678784'){
                if(['points', 'puntos', '>points', '>puntos'].includes(message.content.toLowerCase())) {
                    db.collection(message.guild.id).doc('fantasmita').get().then(s=>{
                        message.reply(`Tienes ${s.data()[message.author.id]??0} puntos acumulados`);
                    })
                } else {
                    message.delete()
                }
            } else if (message.content.toLowerCase().startsWith(prefix)) {
                args = message.content.slice(prefix.length).trim().split(/ +/g);
                return client.emit('command', args.shift().toLowerCase(), message, args);
            }
        } catch (e) {
            util.error(e, `${__dirname}/${__filename}`)
        }
    }
}