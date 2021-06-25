const canvas = require('canvas');
const fs = require('fs');   
module.exports = async (maso) => {
    return new Promise(async (resolve, reject) => {
        let img = await canvas.loadImage(require('../../../src/unoCards.json')['3r'].url);
        const c = canvas.createCanvas(((img.width*maso.length)/2)+(img.width/2), img.height);
        const ctx = c.getContext('2d');
        let p = 0
        // console.log(img.width);
        for (const i of maso) {
            // console.log(i);
            img = await canvas.loadImage(require('../../../src/unoCards.json')[i].url);
            await ctx.drawImage(img, (p*img.width)/2, 0, img.width, img.height);
            // console.log(p*img.width);
            p++
        }
        // fs.writeFile('prueba.png', c.toBuffer('image/png'), err => {
        //     console.log(err);
        // })
        resolve(c.toBuffer('image/png'));
    })
}