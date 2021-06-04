const words = require('../../src/words');
const fs = require('fs');








fs.writeFile('./words.json', `[\n\t"${words.join('",\n\t"')}"\n]`, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log('listo');
    }
})