const { MessageEmbed } = require('discord.js')
const SuggestCommand = require('../commands/suggest');
module.exports = {
    name: 'messageCreate',
    run: async (message) => {
        try {
            // console.log(client.servers.get(message.guild.id)?.channels.suggest);
            if (message.author.bot) return;
            if (message.channel.type == 'DM') return client.emit('directMessage', message);
            if (message.attachments.size > 0) client.emit('messageAttachment', message);
            const prefix = client.servers.get(message.guild.id)?.prefix;
            if(message.channel.id == '893310001282678784'){
            // if(message.channel.id == '893297508128784425'){ // oneki
                if(['points', 'puntos', '>points', '>puntos'].includes(message.content.toLowerCase())) db.collection(message.guild.id).doc('fantasmita').get().then(s=>message.reply(`Tienes ${s.data()[message.author.id]??0} puntos acumulados`).then(async m => util.sleep(10000).then(()=>m.delete().then(()=>message.delete()))))
                else if(['>top', 'top'].includes(message.content.toLowerCase())) db.collection(message.guild.id).doc('fantasmita').get().then(async s=>{
                    const ids = Object.keys(s.data())
                    const puntuajes = []
                    for (const id of ids) {
                        const obj = {}
                        obj[id] = s.data()[id]
                        puntuajes.push(obj)
                    }
                    await puntuajes.sort((a,b) => a[Object.keys(a)[0]] - b[Object.keys(b)[0]]).reverse()
                    const lugar = puntuajes.map((l,i)=>Object.keys(l)[0] == message.author.id? i+1 : false).filter(e=>e)[0]??'ultimo'
                    const embed = new MessageEmbed()
                        .setAuthor('Top Evento Caza Fantasmas')
                        .setTitle(`Tu lugar: ${lugar}`)
                    embed.description = ''
                    for (let i = 0; i < 10; i++) {
                        if (puntuajes[i]) {
                            embed.description += `#${i+1} ${await client.users.fetch(Object.keys(puntuajes[i])[0])} / \`${puntuajes[i][Object.keys(puntuajes[i])[0]]}\` puntos\n`
                        }
                    }
                    message.reply({
                        embeds: [embed]
                    }).then(m=> util.sleep(120000).then(()=>m.delete().then(()=>message.delete())))
                })
                else {
                    message.delete()
                }
            } else if(client.servers.get(message.guild.id)?.channels.suggest.includes(message.channel.id)){
                console.log('sss')
                const suggestCommand = new SuggestCommand()
                const sdb = await db.collection(message.guild.id).doc('suggest').get()
                if (!sdb.exists) return;
                const c = Object.keys(sdb.data()).map(key => sdb.data()[key]==message.channel.id?key:false).filter(o=>o)
                if(!c) return
                suggestCommand.run(message, [c, ...(message.content.split(' '))])
            }else if(message.content.toLowerCase().startsWith(prefix)) {
                args = message.content.slice(prefix.length).trim().split(/ +/g);
                return client.emit('command', args.shift().toLowerCase(), message, args);
            }
        } catch (e) {
            util.error(e, __filename)
        }
    }
}