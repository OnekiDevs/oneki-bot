module.exports = class Join extends require('../classes/Command'){

    constructor() {
        super({
            name: 'join',
            aliases: ['connect'],
            permissions: {
                bot: [],
                member: []
            },
            cooldown: 0,
            args: []
        });
    }

    async run(message, args = []) {
        return;
        message.reply('conectando...').then(m=>util.joinVoice({message,selfMute:false}).then(()=>m.edit('conectado')).catch((e)=>{
            console.log(e)
            m.edit('Estoy ocupado')
        }))
    }

}