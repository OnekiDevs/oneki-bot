const { joinVoiceChannel } = require('@discordjs/voice')
module.exports = (message) => {
    return new Promise(async (resolve) => {
        try {
            let Canalvoz = message.member.voice.channel;
            if (!Canalvoz || Canalvoz.type != "voice") {
                message.channel.send("Necesitas unirte a un canal de voz").catch((error) => message.channel.send(error));
                resolve(false)
            } else if (message.guild.me.voice.channel && Canalvoz.id == message.guild.me.voice.channel.id) {
                resolve(message.guild.me.voice.connection)
            } else if (message.guild.me.voice.channel && message.guild.me.voice.channel.members.size > 1) {
                message.channel.send("Estoy con alguien más");
                resolve(false)
            } else {
                message.channel.send("Conectando...").then((m) => {
                    console.log(m.content);
                    joinVoiceChannel({
                        guildId: message.channel.guild.id, 
                        channelId: message.channel.id
                    }).then((connection) => {
                        console.log('ss');
                        m.edit("Conectado");
                        resolve(connection)
                    });
                });
            }
        } catch (error) {
            throw error;
        }
    });
};