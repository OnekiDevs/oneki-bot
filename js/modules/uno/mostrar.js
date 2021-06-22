const { MessageAttachment } = require('discord.js');
const fetch = require("node-fetch");
module.exports = async (client, interact) => {
    let partida = client.uno.get(interact.data.custom_id.slice(6));
    if (partida && partida[interact.member.user.id]) {
        fetch(`https://discord.com/api/v9/interactions/${interact.id}/${interact.token}/callback`, {
            method: 'POST',
            body: {
                type: 4,
                data: {
                    flags: 1 << 6,
                    content: 'Tus cartas',
                    files: [{ attachment: partida[interact.member.user.id].maso, name: "cartas.png" }]
                }
            },
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bot '+process.env.TOKEN_DISCORD_DEV
            }  
        }).then(res => res.json())
        .then(json => {
            console.log(json)
            console.log(json.errors)
        });
        // client.api.interactions(interact.id, interact.token).callback.post({
        //     data: {
        //         type: 4,
        //         data: {
        //             flags: 1 << 6,
        //             content: 'prueba',
        //             files: [{ attachment: partida[interact.member.user.id].maso, name: "cartas.png" }]
        //         }
        //     }
        // })

        // const msg = await client.api.webhooks(client.user.id, interact.token).messages('@original').get();
    } else {
        client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 6
            }
        });
    }
}