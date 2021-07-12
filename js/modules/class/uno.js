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
        const comenzar = new MessageButton().setLabel('Comenzar').setCustomID(`uno_c_${this.id}`).setStyle('SUCCESS');
        if (this.players.length == 1) comenzar.setDisabled(true);
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
            embed.setImage(require('../../../src/unoCards.json')[this.actualCard.id].url);
            return {
                embeds: [embed],
                components: [[mostrar]]
            };
        }
        
    }
    #mostrar = () => {
        const collector = this.message.createMessageComponentInteractionCollector((mci)=>mci.customID == `uno_m_${this.id}`);
        collector.on('collect', async collect => {
            if (this.players.map(p=>p.id).includes(collect.member.id)) {
                collect.defer({ 
                    ephemeral: true 
                });
                const player = this.players.find(p=>p.id==collect.member.id);
                const maso = await require('../uno/cartas')(player.cartas);
                const attachment = new MessageAttachment(maso, 'cartas.png');
                const jugar = new MessageButton().customID(`uno_j_${this.id}`).setLabel('Jugar').setStyle('PRIMARY').setDisabled(true);
                const comer = new MessageButton().customID(`uno_e_${this.id}`).setLabel('Comenzar').setStyle('PRIMARY');
                const msg = await this.message.guild.channels.cache.get('857846193852907530').send({
                    files: [attachment]
                });
                console.log(msg.content);
                collect.editReply({
                    content: msg.attachments.first().url,
                    components: [[jugar, comer]],
                    ephemeral: true
                });
                this.players = this.players.map(p=>{
                    if (p.id === collect.member.id) p.interact = collect;
                    return p;
                });
            }
        });
    }
    #comer(){
        const collector = this.message.createMessageComponentInteractionCollector((mci)=>mci.customID == `uno_m_${this.id}`);
        collector.on('collect', async collect => {
            collect.deferUpdate();
            const cartas = Object.keys(require('../../../src/unoCards.json'))
            this.players = this.players.map(p=>{
                if (p.id==collect.member.id)  p.cartas.push(cartas[Math.floor(Math.random() * cartas)]);
                return p
            })
            if (this.players.find(p=>p.id==collect.member.id).interact) {
                const maso = await require('../uno/cartas')(player.cartas);
                const attachment = new MessageAttachment(maso, 'cartas.png');
                const jugar = new MessageButton().customID(`uno_j_${this.id}`).setLabel('Jugar').setStyle('PRIMARY').setDisabled(true);
                const comer = new MessageButton().customID(`uno_e_${this.id}`).setLabel('Comenzar').setStyle('PRIMARY');
                const msg = await this.message.guild.channels.cache.get('857846193852907530').send({
                    files: [attachment]
                });
                this.players.find(p.id==collect.member.id).interact.editReply({
                    content: msg.attachments.first().url,
                    components: [[jugar, comer]],
                    ephemeral: true
                });
            }
        });
    }
    #repartir = (n=7) => {
        const cartas = Object.keys(require('../../../src/unoCards.json'))
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
                    }
                    if (this.players.length == this.maxPlayers) {
                        this.#repartir();
                        this.#mostrar();
                        this.#comer();
                        this.status = 'curso'
                        this.message.edit(this.embed);
                        collector.stop();
                        resolve(this.players);
                    }
                } else {
                    if (collect.user.id == this.host) {
                        this.turn = this.players[0];
                        this.status = 'curso';
                        this.message.edit(this.embed);
                        this.#repartir();
                        this.#mostrar();
                        this.#comer();
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
    play(){
        //#TODO flujo de juego 
        //crear un awaitInteraction en el canal filtrando el id del turno actual para escuchar el boton de "jugar" y mostrarle las posibles cartas validas para que lanze
        //quitarla de su mazo y colocarla en actualCard
        //actualizar el embed
        //rotar a jugador actual
        //repetir hasta que halla ganador
    }
    set message(message){this.message = message}
    get message(){return this.message}
    get players(){return this.players}
    get maxPlayers(){return this.players}
    set maxPlayers(max){this.maxPlayers = max}
}