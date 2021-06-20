const { MessageAttachment } = require('discord.js');
const fetch = require("node-fetch");
module.exports = async (client, interact) => {
    let partida = client.uno.get(interact.data.custom_id.slice(6));
    if (partida) {
        client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 5
            }
        })
        const maso = await require('./cartas')(partida[interact.member.user.id].cartas);
        const attachment = new MessageAttachment(maso);

        const msg = await client.api.webhooks(client.user.id, interact.token).messages('@original').get();
        console.log(msg);
        fetch(`https://discord.com/api/v9/webhooks/${client.user.id}/${interact.token}/messages/@original`, { 
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                data: {
                    type: 4,
                    data: {
                        content: 'prueba',
                        components: [
                            {
                                type: 1, 
                                components: [
                                    {
                                        type: 2,
                                        style: 2,
                                        custom_id: `uno_j_rg_${partida.id}`,
                                        label: "rg"
                                    }
                                ]
                            }
                        ],
                        flags: 1 << 6,
                        files: [{ attachment: maso, name: "cartas.png" }]
                    }
                }
            })
        }).then(res => res.json())
        .then(json => {
            console.log(json)
            console.log(json.errors)
        });
        // client.api.webhooks(client.user.id, interact.token).messages('@original').patch({
        //     data: {
        //         type: 4,
        //         data: {
        //             content: 'prueba',
        //             components: [
        //                 {
        //                     type: 1, 
        //                     components: [
        //                         {
        //                             type: 2,
        //                             style: 2,
        //                             custom_id: `uno_j_rg_${partida.id}`,
        //                             label: "rg"
        //                         }
        //                     ]
        //                 }
        //             ],
        //             flags: 1 << 6,
        //             files: [{ attachment: maso, name: "cartas.png" }]
        //         }
        //     }
        // });
    } else {
        client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 6
            }
        });
    }
}