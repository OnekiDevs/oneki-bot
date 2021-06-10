module.exports.ingresar = require('./uno/ingresar');
module.exports.comenzar = require('./uno/comenzar');
module.exports.mostrar = require('./uno/mostrar');
module.exports.repartir = (partida) => {
    return new Promise((resolve, reject) => {
        let cartas = ['0r', '1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '0y', '1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '0b', '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '0g', '1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', '1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', 'py', 'pb', 'pg', 'pr', 'py', 'pb', 'pg', 'pr', 'cy', 'cb', 'cg', 'cr', 'cy', 'cb', 'cg', 'cr', 'ry', 'rb', 'rr', 'rg', 'ry', 'rb', 'rr', 'rg', 'cc', 'cc', 'cc', 'cc', 'cb', 'cr', 'cg', 'cy', 'cb', 'cr', 'cg', 'cy'];
        partida.jugadores.forEach(j=>{
            partida[j] = {
                cartas: []
            };
            for(i=7;i;i--) {
                let carta = cartas[Math.floor(Math.random()*cartas.length)];
                partida[j].cartas.push(carta);
                cartas.splice(cartas.indexOf(carta),1);
            }
        });
        partida.cartas = cartas;
        resolve(partida);
    });
};