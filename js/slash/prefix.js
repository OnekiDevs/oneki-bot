const { Permissions } = require('discord.js');
    const admin = require('firebase-admin');
const serviceAccount = require("../../src/firebase-key.json");
module.exports = {
    data: {
        name: "prefix",
        description: "Cambia el prefijo del bot en este server",
        options: [
            {
                name: "prefix",
                description: "Nuevo prefijo para el bot",
                type: 3,
                required: true
            }
        ]
    },
    server: "all",
    run: async (client, interact) => {
        let opciones = [];
        const guild = await client.guilds.cache.get(interact.guild_id);
        const member = await guild.members.fetch(interact.member.user.id);
        // console.log(client);
        // let config = client.servers.get(interact.guild_id);
        // config.prefix = opciones[0].value
        // client.servers.set(interact.guild_id, config);
        if (!member.hasPermission("MANAGE_GUILD")) {
            return client.api.interactions(interact.id, interact.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "No tienes los permisos para cambiar el prefix del bot.",
                        flags: 1 << 6
                    }
                }
            })
        }
        opciones.push(interact.data.options[0]);
        console.log(opciones[0]);
        client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: 'Prefix cambiado exitosamente a ' + '"' + opciones[0].value + '"'
                }
            }
        });
        const db = admin.firestore();

        console.log(interact.guild_id);
        db.collection(interact.guild_id).doc('config').update({
            prefix: opciones[0].value
        }).catch((err) => {
            if (err.details.startsWith("No document to update")) db.collection(interact.guild_id).doc('config').set({
                prefix: opciones[0].value
            });
        });
        // db.collection(`config`).doc("prefix").update({
        //     prefix: opciones[0].value
        // }).catch((err) => {
        //     if (err.details.startsWith("No document to update")) db.collection(`config`).doc("bot").set({
        //         prefix: opciones[0].value
        //     });
        // });
        // client.settings.prefix = opciones[0].value;
    }
}