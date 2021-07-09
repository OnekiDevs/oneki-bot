const { MessageEmbed, MessageButton } = require('discord.js');
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
        symbol: null
    };
    constructor(id, host){
        this.id = id;
        this.host = host;
        this.players.push(host);
    }
    get embed(){
        const embed = new MessageEmbed();
        embed.title = "UNO Beta (class)";
        embed.addField(`Jugadores ${this.players.length}/${this.maxPlayers}`, `<@${this.players.join('> <@')}>`);
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
    awaitPlayers(){
        return new Promise(resolve => {
            const collector = this.message.createMessageComponentInteractionCollector((mci)=>mci.customID.startsWith('uno_i_')||mci.customID.startsWith('uno_c_'));
            collector.on('collect', collect => {
                if (collect.customID.startsWith('uno_i_')) {
                    if (!this.players.includes(collect.member.id)) {
                        this.players.push(collect.member.id);
                        this.message.edit(this.embed);
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