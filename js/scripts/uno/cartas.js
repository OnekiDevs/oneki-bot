const canvas = require('canvas');
module.exports = async (maso) => {
    return new Promise(async (resolve) => {
        maso = maso.map(m => {
            return {
                id: m,
                ...require('../../../src/unoCards.json')[m]
            }
        });
        let img = await canvas.loadImage(maso[0].url);
        const c = canvas.createCanvas(maso.length <= 10 ?
            ((img.width * maso.length) / 2) + (img.width / 2) :
            ((img.width * maso.length) / 3) + ((img.width / 3) * 2),
            img.height);
        const ctx = c.getContext('2d');
        let p = 0;
        for (const i of maso) {
            img = await canvas.loadImage(i.url);
            await ctx.drawImage(img,
                maso.length <= 10 ?
                (p * img.width) / 2 :
                (p * img.width) / 3,
                0,
                img.width,
                img.height);
            p++;
        }
        resolve(c.toBuffer('image/png'));
    });
}