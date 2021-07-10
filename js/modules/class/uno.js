const { MessageEmbed, MessageButton, MessageAttachment } = require('discord.js');
module.exports = class UNO {
    host = null;
    id = null;
    players = [];
    message = null;
    maxPlayers = 4;
    status = 'esperando'
    turn = null;
    actualCard = {
        id: null,
        color: null,
        symbol: null,
        url:null
    };
    constructor(id, host){
        this.id = id;
        this.host = host;
        this.players.push({
            id: host
        });
    }
    get embed(){
        const embed = new MessageEmbed();
        embed.title = "UNO Beta (class)";
        embed.addField(`Jugadores ${this.players.length}/${this.maxPlayers}`, `<@${this.players.map(p=>p.id).join('> <@')}>`);
        embed.addField('Host', `<@${this.host}>`);
        const ingresar = new MessageButton().setLabel('Ingresar').setCustomID(`uno_i_${this.id}`).setStyle('PRIMARY');
        const comenzar = new MessageButton().setLabel('Comenzar').setCustomID(`uno_c_${this.id}`).setStyle('SUCCESS')/*.setDisabled(true);*/
        const mostrar = new MessageButton().setLabel('Mostrar Cartas').setCustomID(`uno_m_${this.id}`).setStyle('SECONDARY');
        if(this.status == 'esperando') {
            embed.description = "Esperando jugadores (se requieren minimo 2)";
            embed.setThumbnail(require('../../../src/unoCards.json')['1r'].url);
            return {
                embeds: [embed],
                components: [[ingresar, comenzar]]
            };
        } else {
            embed.description = 'Partida en curso, turno de: <@' + this.turn + '>';
            embed.setImage(require('../../../src/unoCards.json')[/*this.actualCard.id*/'1r'].url);
            return {
                embeds: [embed],
                components: [[mostrar]]
            };
        }
        
    }
    #mostrar = () => {
        const collector = this.message.createMessageComponentInteractionCollector((mci)=>mci.customID == `uno_m_${this.id}`);
        collector.on('collect', async collect => {
            //TODO acregar la function del modrar las caetras]
            if (this.players.map(p=>p.id).includes(collect.member.id)) {
                collect.defer({ 
                    ephemeral: true 
                });
                const player = this.players.find(p=>p.id==collect.member.id);
                const maso = await require('../uno/cartas')(player.cartas);
                const attachment = new MessageAttachment(maso, 'cartas.png');
                const msg = await this.message.guild.channels.cache.get('857846193852907530').send({
                    files: [attachment]
                });
                collect.editReply({
                    content: msg.attachments.first().url,
                    ephemeral: true
                });
            }
        });
    }
    #repartir = (n=7) => {
        let cartas = ['0r', '1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '0y', '1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '0b', '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '0g', '1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', 'py', 'pb', 'pg', 'pr', 'cy', 'cb', 'cg', 'cr', 'ry', 'rb', 'rr', 'rg', 'cc', 'cb', 'cr', 'cg', 'cy'];
        this.players = this.players.map(p=>{
            p.cartas = [];
            for (let i=n;i;i--) p.cartas.push(cartas[Math.floor(Math.random() * cartas.length)]);
            return p;
        });
        const randomCard = cartas[Math.floor(Math.random() * cartas.length)];
        this.actualCard = {
            ...require('../../../src/unoCards.json')[randomCard],
            id: randomCard
        };
    }
    awaitPlayers(){
        return new Promise(resolve => {
            const collector = this.message.createMessageComponentInteractionCollector((mci)=>mci.customID == `uno_i_${this.id}`||mci.customID == `uno_c_${this.id}`);
            collector.on('collect', collect => {
                if (collect.customID.startsWith('uno_i_')) {
                    if (!this.players.map(p=>p.id).includes(collect.member.id)) {
                        this.players.push({id:collect.member.id});
                        this.message.edit(this.embed);
                        this.#repartir();
                        this.#mostrar();
                    }
                    if (this.players.length == this.maxPlayers) {
                        resolve(this.players);
                        collector.stop();
                    }
                } else {
                    if (collect.user.id == this.host) {
                        this.turn = this.players[0];
                        this.status = 'curso';
                        this.message.edit(this.embed);
                        this.#repartir();
                        this.#mostrar();
                        resolve(this.players);
                    } else {
                        collect.reply({
                            content: 'Solo el host puede comenzar la partida',
                            ephemeral: true
                        });
                    }
                }
            });
        });
    }
    set message(message){this.message = message}
    get message(){return this.message}
    get players(){return this.players}
    get maxPlayers(){return this.players}
    set maxPlayers(max){this.maxPlayers = max}
}