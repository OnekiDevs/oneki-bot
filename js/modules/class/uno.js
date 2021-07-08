const { MessageEmbed } = require('discord.js');
module.exports = class UNO {
    host = null;
    id = null;
    players = [];
    message = null;
    constructor(id, host){
        this.id = id;
        this.host = host;
        this.players.push(host);
    }
    get embed(){
        const embed = new MessageEmbed();
        embed.title = "UNO Beta (class)"
        embed.description = "Esperando jugadores (se requieren minimo 2)"
        embed.addField(`Jugadores 1/4`, `<@${this.players.join('> <@')}>`)
        embed.addField('Host', `<@${this.host}>`);
        return embed;
    }
    set message(message){
        this.message = message;
    }
    get message(){
        return this.message;
    }
    get players(){
        return this.players
    }
    set player(player){
        this.players.push(player); 
    }
}