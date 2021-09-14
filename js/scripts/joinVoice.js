const { joinVoiceChannel, createAudioPlayer  } = require('discord.js');
module.exports = ({channel, message}) => {
    return new Promise(async (resolve) => {
        try {
            if(!channel) resolve({
                message: 'Necesitas unirte a un canal de voz',
                toString(){return 'false'}
            })
        } catch (error) {
            throw error;
        }
    });
};