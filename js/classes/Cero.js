'use strict';
const { MessageEmbed, MessageButton, MessageAttachment, MessageActionRow, Collection } = require('discord.js');
const shortid = require('shortid');
const Player = require('./Player');
const Players = require('./Players');
module.exports = class Cero {
    host = null;
    id = shortid.generate();
    players = new Players();
    message = null;
    maxPlayers = 4;
    status = 'waiting'
    turn = null; //right
    actualCard = {
        id: null,
        color: null,
        symbol: null,
        url:null
    };
    flow = true;
    winner = null

    constructor(host){
        this.host = host;
        this.turn = host;
        this.players.add(new Player(host));
    }




    //REPARTIR CARTAS (PRIVADO)
    #repartir = (n=7) => {
        return new Promise(async (resolve, reject) => {
            const cartas = Object.keys(require('../../src/unoCards.json'));
            this.players.forEach(player => {
                for (let i=n;i;i--) player.addCard(cartas[Math.floor(Math.random() * cartas.length)]);
            });
            const randomCard = cartas[Math.floor(Math.random() * cartas.length)];
            this.actualCard = {
                ...require('../../src/unoCards.json')[randomCard],
                id: randomCard
            };
            resolve();
        });
    }



    async #jugada(){
        return new Promise((resolve, reject) => {
            const collector = this.message.channel.createMessageComponentCollector({
                filter: mci=>mci.customId.endsWith(this.id),
                // time: 30000
            })
            collector.on('collect', async collect => {
                console.log(collect.customId);
                //BOTON COMER _e_
                if (collect.customId.startsWith('uno_e_')) {
                    collect.deferUpdate();
                    this.players.get(collect.member.id)?.interact.editReply({
                        content: 'actualizando mazo...',
                        components: []
                    });
                    const cartas = Object.keys(require('../../src/unoCards.json'));
                    this.players.get(collect.member.id).addCard(cartas[Math.floor(Math.random() * cartas.length)]);

                    if (this.players.get(collect.member.id)?.interact) {
                        const response = await this.#updatePlayerCard(collect)
                        this.players.find(p=>p.id==collect.member.id).interact.editReply(response);
                    }



                    //BOTON MOSTRAR _m_
                } else if(collect.customId.startsWith('uno_m_')) {
                    if (this.players.has(collect.member.id)) {
                        collect.deferReply({
                            ephemeral: true
                        });
                        const response = await this.#updatePlayerCard(collect)
                        collect.editReply(response);
                        this.players.get(collect.member.id).interact = collect;
                    } else {
                        collect.reply({
                            content: 'no estas en la partida',
                            ephemeral: true
                        })
                    }



                    //BOTON JUGAR _j_
                } else if (collect.customId.startsWith('uno_t_')) {
                    if (collect.user.id == this.turn.id) {
                        collector.stop('collect')
                        resolve(collect)
                    } else {
                        collect.deferUpdate()
                    }
                }


                // collect.defer({
                //     ephemeral: true
                // });
                //repetir hasta que halla ganador
            })
            collector.on('end', async (collect, reazon) => {
                console.log('cerro',reazon)
                if(reazon=='time') reject(reazon)
                else if(reazon != 'collect'){
                    const r = await this.#jugada()
                    resolve(r);
                }
            })
        })
    }

    #updatePlayerCard(collect){
        return new Promise(async resolve => {
            const player = this.players.find(p=>p.id==collect.member.id);
            const maso = await require('../scripts/cartas')(player.cards);
            const attachment = new MessageAttachment(maso, 'cartas.png');
            const msg = await client.channels.cache.get(client.constants.channels.imgs).send({
                files: [attachment]
            });
            let j = 0, k = 0, buttons = [];
            if(collect.member.id == this.turn.id) {
                const cards = player.cards.map(c=>{
                    return {
                        id: c,
                        ...require('../../src/unoCards.json')[c]
                    }
                })
                const dis = cards.filter(c => c.symbol==this.actualCard.symbol || c.color == this.actualCard.color)
                for (const i of dis) {
                    const btn = new MessageButton().setStyle('SUCCESS').setLabel(`${i.symbol} ${i.color}`).setCustomId(`uno_t_${i.id}_${shortid.generate().slice(2)}_${this.id}`)
                    if(j==0) buttons.push(new MessageActionRow().addComponents([btn]))
                    else buttons[k].addComponents([btn])
                    if (j==4) {
                        j=0
                        k++
                    } else j++
                }
            }
            buttons.push(new MessageActionRow().addComponents([new MessageButton().setLabel('Comer').setCustomId(`uno_e_${this.id}`).setStyle('SECONDARY')]))
            const response = {
                content: msg.attachments.first().url,
                components: buttons,
                ephemeral: true
            }
            resolve(response)
        })
    }



    #cicle() {
        this.#jugada().then(async jugada => {
            this.players.get(jugada.member.id).interact.editReply({
                content: 'Actualizando Mazo ...',
                components: []
            });
            const cartaJugada = {
                id: jugada.customId.split('_')[2],
                ...require('../../src/unoCards.json')[jugada.customId.split('_')[2]]
            }
            this.actualCard = cartaJugada;
            jugada.deferUpdate();
            const index = this.players.get(jugada.member.id).cards.indexOf(cartaJugada.id);
            this.players.get(jugada.member.id).cards.splice(index, 1);
            if(this.players.get(jugada.member.id).cards.length == 0) {
                this.winner = this.players.get(jugada.member.id)
                this.status = 'end'
                this.message.edit(this.embed);
            } else {
                this.players.rotate(this.flow);
                this.turn = this.players.first();
                //TODO hacer que las cartas especiales tengan funcion
                if(!((/\d[r|g|y|b]/).test(cartaJugada.id))) {
                    if((/p[r|g|y|b]/).test(cartaJugada.id)) {
                        const cartas = Object.keys(require('../../src/unoCards.json'));
                        this.turn.addCard(cartas[Math.floor(Math.random() * cartas.length)]);
                        this.turn.addCard(cartas[Math.floor(Math.random() * cartas.length)]);
                    } else if((/r[r|g|y|b]/).test(cartaJugada.id)) {
                        this.flow = !this.flow
                        this.players.rotate(this.flow);
                        this.players.rotate(this.flow);
                    } else if((/r[r|g|y|b]/).test(cartaJugada.id)) {
                        this.players.rotate(this.flow);
                        this.turn = this.players.first();
                    } else if(cartaJugada.id == 'p4') {
                        const cartas = Object.keys(require('../../src/unoCards.json'));
                        this.turn.addCard(cartas[Math.floor(Math.random() * cartas.length)]);
                        this.turn.addCard(cartas[Math.floor(Math.random() * cartas.length)]);
                        this.turn.addCard(cartas[Math.floor(Math.random() * cartas.length)]);
                        this.turn.addCard(cartas[Math.floor(Math.random() * cartas.length)]);
                    }
                }
                this.message.edit(this.embed);
                const res = await this.#updatePlayerCard(this.turn.interact);
                this.turn.interact.editReply(res)
                this.#cicle();
                const response = await this.#updatePlayerCard(jugada);
                this.players.get(jugada.member.id).interact.editReply(response);
            }
        }).catch(async reason => {
            if (reason != 'time') console.log(reason);
            const inter = this.turn.interact;
            this.players.rotate(this.flow);
            this.turn = this.players.first();
            this.message.edit(this.embed);
            const res = await this.#updatePlayerCard(this.turn.interact);
            this.turn.interact.editReply(res)
            this.#cicle();
            const response = await this.#updatePlayerCard(inter);
            this.players.get(jugada.member.id).interact.editReply(response);
            this.#cicle()
        })
    }

    //ESPERA DE JUGADORES
    awaitPlayers(){
        return new Promise(resolve => {
            const collector = this.message.createMessageComponentCollector((mci)=>mci.customId == `uno_i_${this.id}`||mci.customId == `uno_c_${this.id}`);
            collector.on('collect', async collect => {
                if (collect.customId.startsWith('uno_i_')) {
                    if (!this.players.has(collect.member.id)) {
                        this.players.add(new Player(collect.member.id));
                        this.message.edit(this.embed);
                    }
                    collect.deferUpdate()
                    if (this.players.size == this.maxPlayers) {
                        await this.#repartir();
                        this.status = 'progress'
                        this.message.edit(this.embed);
                        collector.stop();
                        resolve(this.players);
                    }
                } else {
                    if (collect.user.id == this.host) {
                        this.turn = this.players.first();
                        this.status = 'progress';
                        await this.#repartir();
                        collect.deferUpdate();
                        this.message.edit(this.embed);
                        // this.#buttons();
                        collector.stop();
                        resolve(this.players);
                    } else collect.reply({
                        content: 'Solo el host puede comenzar la partida',
                        ephemeral: true
                    });
                }
            });
        });
    }




    /*
    * Inicia y controla el flujo de juego
    */
    async play(){
        this.#cicle()
    }


    //SETTERS Y GETTERS
    set message(message){this.message = message}
    get message(){return this.message}
    get players(){return this.players}
    get maxPlayers(){return this.maxPlayers}
    set maxPlayers(max){this.maxPlayers = max}
    get turn(){return this.players.first()}
    get embed(){
        const embed = new MessageEmbed();
        embed.title = "Cero Game";
        embed.addField(`Jugadores ${this.players.size}/${this.maxPlayers}`, `${this.players}`);
        embed.addField('Host', `<@${this.host}>`);
        let buttons = [new MessageActionRow()];
        if (this.players.length == 1) comenzar.setDisabled(true);
        const mostrar = new MessageButton().setLabel('Mostrar Cartas').setCustomId(`uno_m_${this.id}`).setStyle('SECONDARY');
        if(this.status == 'waiting') {
            buttons[0].addComponents([
                new MessageButton().setLabel('Ingresar').setCustomId(`uno_i_${this.id}`).setStyle('PRIMARY'),
                new MessageButton().setLabel('Comenzar').setCustomId(`uno_c_${this.id}`).setStyle('SUCCESS')]);
            embed.description = "Esperando jugadores (se requieren minimo 2)";
            embed.setThumbnail(require('../../src/unoCards.json')['1r'].url);
        } else if(this.status == 'end') {
            embed.description = `Partida terminada, Ganador: ${this.winner}`;
            buttons = []
        } else {
            embed.description = `Partida en curso, turno de: <@${this.turn.id}>`;
            buttons[0].addComponents([mostrar]);
            embed.setImage(this.actualCard.url);
        }
        embed.setFooter(`${client.user.username} Bot ${require('../../package.json').version}`, client.user.avatarURL());

        return {
            embeds: [embed],
            components: [buttons]
        };
    }
}