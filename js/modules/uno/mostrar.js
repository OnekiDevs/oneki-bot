const canvas = require('canvas');
const { MessageAttachment } = require('discord.js');
const fs = require('fs');
module.exports = async (client, interact) => {
    let partida = client.uno.get(interact.data.custom_id.slice(6))
    const cartas = require('../../../src/unoCards.json');
    console.log(partida[interact.member.user.id].cartas);
    let img = await canvas.loadImage(cartas['3r'].url);
    const c = canvas.createCanvas(((img.width*cartas.length)/2)+(img.width/2), img.height);
    const ctx = c.getContext('2d')
    let p = 0;
    for (const i of partida[interact.member.user.id].cartas) {
        console.log(i);
        img = await canvas.loadImage(cartas[i].url)
        await ctx.drawImage(img, (p*img.width)/2, 0, img.width, img.height);
        p++
    }
    const buff = await c.toBuffer('image/png', {
        compressionLevel: 6,
        filters: canvas.PNG_ALL_FILTERS
    });
    console.log(buff);
    const attachment = new MessageAttachment(buff);
    console.log(attachment);
    if (partida) {
        client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 4,
                data: {
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
                    files: [attachment]
                }
            }
        });
    } else {
        client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 6
            }
        });
    }
}