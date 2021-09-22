const puppeteer = require('puppeteer');
const  { MessageAttachment, Permissions } = require('discord.js')
module.exports = {
    name: 'say',
    botPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
    userPermissions: [],
    alias: ['di'],
    run: async (message, args) => {
        //eliminamos el mensaje
        message.delete();
        // comprobamos que halla escrito texto
        if(!args[0]) return 
        //message.channel.send("Tambien escribe lo que quieres que diga").then(m => m.delete({ timeout: 5000 }));
        //creamos un muevo texto con .map para validar palabra por palabra
        const texto = args.map(p=>{
            //si es admin no importará si tenga mención
            if (message.member.hasPermission('ADMINISTRATOR')) {
                return p;
            //si contiene un @everyone o @here y no tiene permisos retorna un everyone sin mención
            } else if (!message.member.permissions.has("MENTION_EVERYONE") && (p.includes("@everyone") || p.includes("@here"))) {
                return p.replace(/@/gi, "");
            //comprobamos que sea un rol
            } else if(p.startsWith("<@&")&& p.endsWith(">")) {
                //si es rol lo obtenemos
                let rol = message.guild.roles.cache.get(p.substring(3, p.length-1));
                //si no existe retorna la palabra
                if (!rol) {
                    return p;
                //si el rol es mencionable lo retornamos
                } else if (rol.mentionable) {
                    return p;
                //si no se puede mencionar retornamos solo el nombre
                } else {
                    return rol.name;
                }
            //si no contiene mención retornamos la palabra
            } else {
                return p;
            }
        });
        // si el primer argumento no es una mención a un canal
        //elviemos el texto procesado en el canal donde se escribió
        if(args[0].match(/<#(\d{17,19})>/) || client.channels.cache.get(args[0])){
            //comprobamos que contenga texto nuevamente
            if(!args[1]) return 
            //message.channel.send("Tambien escribe lo que quieres que diga").then(m => m.delete({ timeout: 5000 }));
            //obtenemos el canal
            const canal = message.mentions.channels.first() || !client.channels.cache.get(args[0]);
            //si no existe
            if (!canal) return 
            //message.channel.send("Canal no encontrado").then(m => m.delete({ timeout: 5000 }));
            //si está en orden enviamos el mensaje eliminando el primer argumento (que es el canal)
            canal.send(texto.slice(1).join(' '));
        //si contiene una mención
        }else{
            message.channel.send(texto.join(' '));
        }
    }
}