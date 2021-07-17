const canvas = require('canvas');
const fs = require('fs');   
module.exports = async (maso) => {
    return new Promise(async (resolve, reject) => {
        let img = await canvas.loadImage(require('../../../src/unoCards.json')['3r'].url);
        const c = canvas.createCanvas(maso.length <= 10 ? ((img.width*maso.length)/2)+(img.width/2) : ((img.width*maso.length)/3)+((img.width/3)*2), img.height);
        const ctx = c.getContext('2d');
        let p = 0
        for (const i of maso) {
            if(i) {
                img = await canvas.loadImage(require('../../../src/unoCards.json')[i].url);
                await ctx.drawImage(img, maso.length <= 10 ? (p*img.width)/2 : (p*img.width)/3, 0, img.width, img.height);
            }
            p++
        }
        fs.writeFile('prueba.png', c.toBuffer('image/png'), err => {
            console.log(err);
        })
        resolve(c.toBuffer('image/png'));
    })
}