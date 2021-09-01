'use strict';
const { MessageEmbed, MessageButton, MessageAttachment, MessageActionRow, Collection } = require('discord.js');
const shortid = require('shortid');
const Player = require('./Player');
const Players = require('./Players');
module.exports = class UNO {
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

    constructor(host){
        this.host = host;
        this.players.set(host, new Player(host));
    }


    
    // #buttons = () => {
    //     const collector = this.message.createMessageComponentCollector((mci)=>mci.customId == `uno_m_${this.id}`);
    //     collector.on('collect', async collect => {
    //         console.log(collect.customId);
    //         if (this.players.map(p=>p.id).includes(collect.member.id)) {
    //             collect.defer({ 
    //                 ephemeral: true 
    //             });
    //             const player = this.players.find(p=>p.id==collect.member.id);
    //             const maso = await require('../uno/cartas')(player.cartas);
    //             const attachment = new MessageAttachment(maso, 'cartas.png');
    //             const msg = await this.message.guild.channels.cache.get('857846193852907530').send({
    //                 files: [attachment]
    //             });
    //             const jugar = new MessageButton().setLabel('Jugar').setCustomId(`uno_j_${this.id}`).setStyle('PRIMARY')
    //             const comer = new MessageButton().setLabel('Comer').setCustomId(`uno_e_${this.id}`).setStyle('SECONDARY');
    //             const buttons = new MessageActionRow().addComponents([jugar, comer]);
    //             collect.editReply({
    //                 content: msg.attachments.first().url,
    //                 components: [buttons],
    //                 ephemeral: true
    //             });
    //             this.players.map(p=>{
    //                 if (p.id==collect.member.id) p.interact = collect;
    //                 return p
    //             })
    //         }
    //     });
    // }





    //REPARTIR CARTAS (PRIVADO)
    #repartir = (n=7) => {
        return new Promise(async (resolve, reject) => {
            const cartas = Object.keys(require('../../../src/unoCards.json'))
            this.players.forEach(player => {
                for (let i=n;i;i--) player.addCard(cartas[Math.floor(Math.random() * cartas.length)]);
            })
            console.log(this.players);
            const randomCard = cartas[Math.floor(Math.random() * cartas.length)];
            this.actualCard = {
                ...require('../../../src/unoCards.json')[randomCard],
                id: randomCard
            };
            resolve();
        })
    }




    //ESPERA DE JUGADORES
    awaitPlayers(){
        return new Promise(resolve => {
            const collector = this.message.createMessageComponentCollector((mci)=>mci.customId == `uno_i_${this.id}`||mci.customId == `uno_c_${this.id}`);
            collector.on('collect', async collect => {
                console.log(collect.customId);
                if (collect.customId.startsWith('uno_i_')) {
                    if (!this.players.has(collect.member.id)) {
                        this.players.set(collect.member.id, new Player(collect.member.id));
                        this.message.edit(this.embed);
                    } else collect.deferUpdate()
                    if (this.players.size == this.maxPlayers) {
                        await this.#repartir();
                        // this.#buttons();
                        this.status = 'curso'
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





    //FLUJO DE JUEGO
    play(){
        console.log('Play');
        //escucha los botones mostrar _m_ | comer _e_ | jugar _j_
        const collector = this.message.channel.createMessageComponentCollector(mci=>mci.customId == `uno_m_${this.id}` || mci.customId == `uno_j_${this.id}` || mci.customId == `uno_e_${this.id}`)
        collector.on('collect', async collect => {
            console.log(collect.customId);


            //BOTON JUGAR _j_
            if (collect.customId.startsWith('uno_j_')) {


            //BOTON COMER _e_
            } else if (collect.customId.startsWith('uno_e_')) {
                collect.deferUpdate();
                this.players.get(collect.member.id)?.interact.editReply({
                    content: 'actualizando mazo...',
                    components: []
                })
                const cartas = Object.keys(require('../../../src/unoCards.json'));
                this.players.get(collect.member.id).addCard(cartas[Math.floor(Math.random() * cartas.length)]);
                if (this.players.get(collect.member.id)?.interact) {
                    const maso = await require('../uno/cartas')(this.players.find(p=>p.id==collect.member.id).cards);
                    const attachment = new MessageAttachment(maso, 'cartas.png');
                    const msg = await this.message.guild.channels.cache.get('857846193852907530').send({
                        files: [attachment]
                    });
                    this.players.find(p=>p.id==collect.member.id).interact.editReply({
                        content: msg.attachments.first().url,
                        components: [new MessageActionRow().addComponents([new MessageButton().setLabel('Jugar').setCustomId(`uno_j_${this.id}`).setStyle('PRIMARY'), new MessageButton().setLabel('Comer').setCustomId(`uno_e_${this.id}`).setStyle('SECONDARY')])],
                        ephemeral: true
                    });
                }



            //BOTON MOSTRAR _m_
            } else if(collect.customId.startsWith('uno_m_')) {
                if (this.players.has(collect.member.id)) {
                    collect.deferReply({ 
                        ephemeral: true 
                    });
                    const player = this.players.find(p=>p.id==collect.member.id);
                    const maso = await require('../uno/cartas')(player.cards);
                    const attachment = new MessageAttachment(maso, 'cartas.png');
                    const msg = await this.message.guild.channels.cache.get('857846193852907530').send({
                        files: [attachment]
                    });
                    const jugar = new MessageButton().setLabel('Jugar').setCustomId(`uno_j_${this.id}`).setStyle('PRIMARY')
                    const comer = new MessageButton().setLabel('Comer').setCustomId(`uno_e_${this.id}`).setStyle('SECONDARY');
                    const buttons = new MessageActionRow().addComponents([jugar, comer]);
                    collect.editReply({
                        content: msg.attachments.first().url,
                        components: [buttons],
                        ephemeral: true
                    });
                    this.players.get(collect.member.id).interact = collect;
                }
            }



            // collect.defer({ 
            //     ephemeral: true 
            // });
            //repetir hasta que halla ganador
        }) 
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
        embed.title = "UNO Beta (class)";
        embed.addField(`Jugadores ${this.players.size}/${this.maxPlayers}`, `${this.players.map(p=>`${p}`).join(', ')}`);
        embed.addField('Host', `<@${this.host}>`);
        const ingresar = new MessageButton().setLabel('Ingresar').setCustomId(`uno_i_${this.id}`).setStyle('PRIMARY')
        const comenzar = new MessageButton().setLabel('Comenzar').setCustomId(`uno_c_${this.id}`).setStyle('SUCCESS');
        const buttons = new MessageActionRow();
        // if (this.players.length == 1) comenzar.setDisabled(true);
        const mostrar = new MessageButton().setLabel('Mostrar Cartas').setCustomId(`uno_m_${this.id}`).setStyle('SECONDARY');
        if(this.status == 'waiting') {
            buttons.addComponents([ingresar, comenzar]);
            embed.description = "Esperando jugadores (se requieren minimo 2)";
            embed.setThumbnail(require('../../../src/unoCards.json')['1r'].url); 
            return {
                embeds: [embed],
                components: [buttons]
            };
        } else {
            embed.description = 'Partida en curso, turno de: <@' + this.turn.id + '>';
            buttons.addComponents([mostrar]);
            embed.setImage(require('../../../src/unoCards.json')[this.actualCard.id].url);
            return {
                embeds: [embed],
                components: [buttons]
            };
        }
        
    }
}