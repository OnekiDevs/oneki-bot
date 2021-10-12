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
        (await client.channels.fetch("887514182474428446")).send({
            content: process.env.NODE_ENV!=='production'?process.env.DEVELOPER_ID?`<@${process.env.DEVELOPER_ID}>`:null:'<@&887514697690128425>',
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
    async joinVoice({message, member, channelId, guildId, adapterCreator, selfMute, selfDeaf}) {
        return new Promise(async (resolve, reject) => {
            try {
                member = member??message?.member
                if(!member){
                    if(!channelId || !guildId || !adapterCreator) reject('requiere {(member | message) | (channelId, guildId, adapterCreator)}')
                    else {
                        const voiceConnection = await joinVoiceChannel({
                            channelId,
                            guildId,
                            adapterCreator
                        })
                        resolve(voiceConnection)
                    }
                } else {
                    if(member.voice.channel?.id){
                        if((!member.guild.me.voice.channel?.id) || (member.voice.channel.members.size == 1) || (member.voice.channel?.id === member.guild.me.voice.channel?.id)){ //el bot no esta en canal || esta solo || es el mismo canal
                            const voiceConnection = await joinVoiceChannel({
                                channelId: member.voice.channel.id,
                                guildId: member.guild.id,
                                adapterCreator: member.guild.voiceAdapterCreator
                            })
                            resolve(voiceConnection)
                        } else { //lo estan ocupando
                            reject('bot ocupped')
                        }
                    } else reject('member need a voice connection');
                }
            } catch (e) {
                reject(e.toString())
            }
        })
    }
}