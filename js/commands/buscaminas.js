const fetch = require("node-fetch");
const shortid = require("shortid");
module.exports = {
    name: "buscaminas",
    botPermissions: [],
    usersPermissions: [],
    alias: ['minesearch'],
    run: async (client, message, args) => {
        //se definen las filas, columnas y bombas
        let filas = 9, columnas = 9, bombas = 15;
        //se crea una matriz de 9x9
        var matriz = new Array(filas);
        for (let x = 0; x < filas; x++) {
            matriz[x] = new Array(columnas);
        }
        //se inicializa con 0
        for (let x = 0; x < filas; x++) {
            for (let y = 0; y < columnas; y++) {
                matriz[x][y] = 0;
            }
        }
        imprimir(matriz, filas, columnas);
        //se colocan bombas aleatoriamente
        while (bombas != 0) {
            let filaRandom = Math.floor(Math.random() * filas);
            let columnaRandom = Math.floor(Math.random() * columnas);
            //si la posicion ya tiene bomba se genera otra
            while (matriz[filaRandom][columnaRandom] == 9) {
                filaRandom = Math.floor(Math.random() * filas);
                columnaRandom = Math.floor(Math.random() * columnas);
            }
            //se añade la bomba = 9
            matriz[filaRandom][columnaRandom] = 9;
            bombas--;
        }
        imprimir(matriz, filas, columnas);
        //recorremos todas las casillas para colocar los mumeros
        for (let x = 0; x < filas; x++) {
            for (let y = 0; y < columnas; y++) {
                //inicializa
                let cercanas = 0;
                //validamos que no sea una bomba (9)
                if (matriz[x][y] != 9) {
                    //revisamos las casillas que están al rededor para buscar bombas (9)
                    //comprobamos que la casilla existe
                    if (matriz[x + 1] && matriz[x + 1][y]) {
                        //revisamos si la casilla es una bomba (9)
                        if (matriz[x + 1][y] == 9) {
                            //si lo es sumamos una
                            cercanas++;
                        }
                        //si no pasamos a la siguiente casilla
                    }
                    //se repite el proceso con las otras 7 casillas al rededor
                    if (matriz[x + 1] && matriz[x + 1][y + 1]) {
                        if (matriz[x + 1][y + 1] == 9) {
                            cercanas++;
                        }
                    }
                    if (matriz[x] && matriz[x][y + 1]) {
                        if (matriz[x][y + 1] == 9) {
                            cercanas++;
                        }
                    }
                    if (matriz[x + 1] && matriz[x + 1][y - 1]) {
                        if (matriz[x + 1][y - 1] == 9) {
                            cercanas++;
                        }
                    }
                    if (matriz[x] && matriz[x][y - 1]) {
                        if (matriz[x][y - 1] == 9) {
                            cercanas++;
                        }
                    }
                    if (matriz[x - 1] && matriz[x - 1][y - 1]) {
                        if (matriz[x - 1][y - 1] == 9) {
                            cercanas++;
                        }
                    }
                    if (matriz[x - 1] && matriz[x - 1][y + 1]) {
                        if (matriz[x - 1][y + 1] == 9) {
                            cercanas++;
                        }
                    }
                    if (matriz[x - 1] && matriz[x - 1][y]) {
                        if (matriz[x - 1][y] == 9) {
                            cercanas++;
                        }
                    }
                    //establecemos cuantas bombas (9) están cercanas
                    matriz[x][y] = cercanas;
                    //se repite el ciclo con todas las casillas
                }
            }
        }
        imprimir(matriz, filas, columnas);
        enviar(matriz, filas, columnas, message);
    }
};

function imprimir(matriz, filas, columnas) {
    for (let x = 0; x < filas; x++) {
        let fila = "";
        for (let y = 0; y < columnas; y++) {
            fila += ` ${matriz[x][y]} `
        }
    }
    console.log("")
}

function enviar(matriz, filas, columnas, message) {
    //creamos los emojis que remplazarán los muneros
    const choices = [
        "||:zero:||", "||:one:||", "||:two:||",
        "||:three:||", "||:four:||", "||:five:||", "||:six:||", 
        "||:seven:||", "||:eight:||", "||:bomb:||"
    ];
    //inicializamos el mensaje
    let buscaminas = "";
    //recorremos x
    for (let x = 0; x < filas; x++) {
        //recorremos y
        for (let y = 0; y < columnas; y++) {
            //colocamos el emoji correspondiente a la casilla
            buscaminas += `${choices[matriz[x][y]]} `
        }
        //cuando termine de recorrer y se agrega un salto de linea y se repite el ciclo
        buscaminas += "\n";
    }
    //terminando el ciclo entero se envia el mensaje
    message.channel.send(buscaminas);
}