const {MessageEmbed} = require("discord.js");
const {joinVoiceChannel} = require("@discordjs/voice");

module.exports = {
    /**
     * Detiene el proceso momentaneamente
     * @param ms
     * @returns {Promise<void>}
     */
    sleep(ms = 1000){
        return new Promise(resolve => setTimeout(resolve, ms))
    },
    lang: require('./langs'),
    /**
     * Remplaza multiples coincidencias de texto
     * @param text
     * @param array[{match:RegEx, replace:string}]
     * @returns text
     */
    replace(text, array = []) {
        try {
            for (const i of array) text = text.replace(i.match, i.replace);
            return text;
        } catch (error) {
            return error;
        }
    },
    /**
     * Crea una alerta de error
     * @param error
     * @param file
     * @returns none
     */
    async error(error, file) {
        console.log("\x1b[31m%s\x1b[0m", "*****************************************************************\n", error, "\x1b[31m%s\x1b[0m", "*****************************************************************");
        (await client.channels.fetch(client.constants.channels.errors)).send({
            content: process.env.NODE_ENV!=='production'?process.env.DEVELOPER_ID?`<@${process.env.DEVELOPER_ID}>`:null:`<@&${client.constants.rolls.js}>`,
            embeds: [
                new MessageEmbed()
                    .setColor("YELLOW")
                    .setTitle("New Error Detected")
                    .addField("Error Type", "```cmd\n" + error.name + "\n```", true)
                    .addField("Error Message", "```cmd\n" + error.message + "\n```", true)
                    .addField("Error In", '```cmd\n'+file+'\n```', true),
                new MessageEmbed()
                    .setColor("YELLOW")
                    .setTitle("Error Stack")
                    .setDescription(`\`\`\`cmd\n${error.stack}\n\`\`\``),
            ],
        });
    },
    /**
     *
     * @param message?:message
     * @param member?:member
     * @param channelId?:string
     * @param guildId?:string
     * @param adapterCreator?:adapterCreator
     * @param selfMute?:boolean
     * @param selfDeaf?:boolean
     * @returns {Promise<voiceConnection>}
     */
    async joinVoice({message, member, channelId, guildId, adapterCreator, selfMute, selfDeaf, guild}) {
        return new Promise(async (resolve, reject) => {
            try {
                member = member??message?.member
                if(!member){
                    if(!channelId || !guildId || !adapterCreator) reject('requiere {(member | message) | (channelId, guildId, adapterCreator)}')
                    else {
                        const voiceConnection = joinVoiceChannel({
                            channelId,
                            guildId,
                            adapterCreator
                        })
                        resolve(voiceConnection)
                    }
                } else {
                    let m;
                    console.log(!member.guild.me.voice.channel)
                    if((((member.voice.channel && member.guild.me.voice.channel) && (member.voice.channel?.id != member.guild.me.voice.channel?.id)) || (!member.guild.me.voice.channel)) && message) m = await message.reply('conectando...')
                    if(member.voice.channel?.id){
                        if((!member.guild.me.voice.channel) || (member.guild.me.voice.channel.members.size == 1) || (member.voice.channel?.id === member.guild.me.voice.channel?.id)){ //el bot no esta en canal || esta solo || es el mismo canal
                            const voiceConnection = joinVoiceChannel({
                                channelId: member.voice.channel.id,
                                guildId: member.guild.id,
                                adapterCreator: adapterCreator??member.guild.voiceAdapterCreator
                            })
                            m?.edit('conectado')
                            resolve(voiceConnection)
                        } else { //lo estan ocupando
                            m?.edit('Estoy ocupado')
                            reject('bot ocupped')
                        }
                    } else {
                        m?.edit('nesesitas estar en un canal de voz')
                        reject('member need a voice connection');
                    }
                }
            } catch (e) {
                console.log(e)
                reject(e.toString())
            }
        })
    }
}