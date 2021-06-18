const canvas = require('canvas');
const fs = require('fs');

(async ()=>{
    let cartas = [], crt = ['0r', '1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '0y', '1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '0b', '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '0g', '1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', '1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', 'py', 'pb', 'pg', 'pr', 'py', 'pb', 'pg', 'pr', 'cy', 'cb', 'cg', 'cr', 'cy', 'cb', 'cg', 'cr', 'ry', 'rb', 'rr', 'rg', 'ry', 'rb', 'rr', 'rg', 'cc', 'cc', 'cc', 'cc', 'cb', 'cr', 'cg', 'cy', 'cb', 'cr', 'cg', 'cy'];
    for(i=7;i;i--) cartas.push(crt.splice(crt.indexOf(crt[Math.floor(Math.random()*crt.length)]),1)[0]);
    let img = await canvas.loadImage(require('../../src/unoCards.json')['3r'].url)
    const c = canvas.createCanvas(((img.width*cartas.length)/2)+(img.width/2), img.height);
    const ctx = c.getContext('2d')
    let p = 0
    console.log(img.width);
    for (const i of cartas) {
        console.log(i);
        img = await canvas.loadImage(require('../../src/unoCards.json')[i].url)
        await ctx.drawImage(img, (p*img.width)/2, 0, img.width, img.height)
        console.log(p*img.width);
        p++
    }
    fs.writeFile('prueba.png', c.toBuffer('image/png'), err => {
        console.log(err);
    })
})()