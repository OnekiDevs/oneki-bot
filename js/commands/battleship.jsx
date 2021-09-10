// const { createRandom, renderCanvasOp, createWithe, renderCanvasPl, win, sleep } = require("../scripts/canvaship");
const { MessageAttachment, MessageEmbed, MessageCollector } = require("discord.js");
module.exports = {
    name: "Battleship",
    alias: [],
    userPermissions: [],
    botPermissions: ['MANAGE_MESSAGES', 'MANAGE_CHANNELS'],
    bot: false,
    category: "Diversión",
    description: "Juega battleship con un amigo (beta)",
    use: ".battleship <@user>",
    example: ".battleship @usuario",
    run: async (message, args) => {
        return;
        console.log(1)
        // obtengo usuario
        const usuario = message.mentions.users.first();
        //si no hay rival
        if (!usuario) {
            //creo un canal nuevo
            const canal = await message.guild.channels.create(`battleship-${message.author.username}`, {
                type: "text",
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: ["VIEW_CHANNEL"],
                    },
                    {
                        id: message.author.id,
                        allow: ["VIEW_CHANNEL"],
                    },
                    {
                        id: client.user.id,
                        allow: ["VIEW_CHANNEL"],
                    }
                ],
            });
            //lanso una imagen
            let espera = await sendIMG(canal, message);
            //reviso respuesta de menu
            while (!espera.respuesta) {
                espera = await sendIMG(canal, message);
            }
            espera.mensaje.delete();
            //muestro su tablero
            let msgPl = await canal.send({
                files: [espera.snapshot],
                content: `Tu Tablero <@${message.author.id}>`,
            });
            const tablero = espera.tablero;
            //creo el tablero del bot
            const tabBot = await createWithe({ format: "png", dim: 450 });
            // envio el tablero del bot
            // const pnewTabPl = await renderCanvasPl(tabBot.array, { format: "png", dim: 450 });
            let msgop = await canal.send({
                files: [tabBot.tablero],
                content: `Tu oponente (Kone)`,
            });
            await canal.send('Lanza misiles escribiendo las coordenadas en tu turno ([x][y] donde `x` son las letras y `y` los numeros)\nSi a mitad de partida quieres rendirte solo escribe `rendirse` en tu turno');
            let arrayBot = tabBot.array;
            let ganador, rendicion;
            //establezco turno
            let turno = message.author.id;
            //muestro turno
            // canal.edit({ topic: `Turno de ${message.author.username}` });
            //mientras no halla ganador se repte
            let newTabPl, newTabBot;
            while (!ganador || !rendicion) {
                console.log(turno)
                // si es turno del jugador
                if (turno == message.author.id) {
                    // await canal.edit({ topic: `Turno de ${message.author.username}` });
                    let jugada;
                    do {
                        //esperamos su jugada
                        jugada = await obtenerJugada(canal, message);
                        if (jugada.y <= 3) {
                            const isRepeat = await repeat(arrayBot, jugada.x, jugada.y);
                            if (isRepeat) {
                                jugada = false;
                                const my = await canal.send('ya has lanzado a esa coordenada')
                                my.delete({ timeout: 5000 })
                            }
                        } else if (jugada.y == 200) {
                            rendicion = true;
                            break;
                        }
                        //su hubo jugada
                        if (jugada && jugada.y != 100) {
                            msgop.delete();
                            //modificamos el tablero del bot
                            if (arrayBot[jugada.x][jugada.y] == 0) {
                                arrayBot[jugada.x][jugada.y] = 2;
                            } else if (arrayBot[jugada.x][jugada.y] == 1) {
                                arrayBot[jugada.x][jugada.y] = 3;
                            }
                            //renderizar jugada y reenviar
                            newTabBot = await renderCanvasOp(arrayBot, { format: "png", dim: 450 });
                            msgop = await canal.send({
                                files: [newTabBot],
                                content: `Tu ponente (<@708344310734651473>)`,
                            });
                        }
                    } while (!jugada);
                    if (rendicion) {
                        break;
                    }
                    ganador = await win(message.author.id, arrayBot);
                    turno = "bot";
                    // canal.edit({ topic: "Turno de Kone" });
                } else {
                    // await canal.edit({ topic: `Turno de ${client.user.username}` });
                    //turno de kone
                    await sleep(2000);
                    let x, y, jugada;
                    do {
                        x = Math.floor(Math.random() * tablero.length);
                        y = Math.floor(Math.random() * tablero[0].length);
                        console.log(x ,y);
                        if (tablero[x][y] == 0) {
                            msgPl.delete();
                            tablero[x][y] = 2;
                            jugada = true;
                        } else if (tablero[x][y] == 1) {
                            tablero[x][y] = 3;
                            msgPl.delete();
                            jugada = true;
                        } else if (tablero[x][y] >= 2) {
                            jugada = false;
                        }
                        console.log(4);
                    } while (!jugada);
                    ganador = await win("708344310734651473", tablero);
                    newTabPl = await renderCanvasPl(tablero, { format: "png", dim: 450 });
                    msgPl = await canal.send({
                        files: [newTabPl],
                        content: `Tu Tablero (<@${message.author.id}>)`,
                    });
                    turno = message.author.id;
                    // canal.edit({ topic: "Tu turno" });
                }
            }
            if (rendicion) {
                canal.send(`Ganador <@${client.user.id}>`);
            } else {
                canal.send(`Ganador <@${ganador}>`);
            }
            canal.send(`Este canal se autodestruirá en 30 segundos`);
            if (!rendicion) {
                message.channel.send({
                    content: `Resultado de juego\n<@${message.author.id}> vs <@${client.user.id}>`,
                });
                message.channel.send({
                    files: [newTabBot],
                    content: `tablero de <@${client.user.id}>`,
                });
                message.channel.send({
                    files: [newTabPl],
                    content: `tablero de <@${message.author.id}>`,
                });
                message.channel.send(`Ganador <@${ganador}>`);                
            }
            await sleep(30000);
            canal.delete();
        }
    },
};

async function sendIMG(canal, message) {
    const snapshot = await createRandom({ format: "png", dim: 450 });
    const mensaje = await canal.send({
        files: [snapshot.tablero],
        content: `Primero Escoge tu tablero <@${message.author.id}>\nReacciona con\n:twisted_rightwards_arrows: para cambiar\n:ballot_box_with_check: para escoger\ntienes 30 segundos para reaccionar`,
    });
    mensaje.react("🔀");
    mensaje.react("☑");
    return new Promise(async (resolve) => {
        const respuesta = await awaitReaction(mensaje, message);
        const promesa = {
            tablero: snapshot.array,
            respuesta: respuesta,
            mensaje: mensaje,
            snapshot: snapshot.tablero,
        };
        resolve(promesa);
    });
}

async function awaitReaction(mensaje, message) {
    const filter = (reaction, user) => ["🔀", "☑"].includes(reaction.emoji.name) && user.id === message.author.id;
    const collector = mensaje.createReactionCollector(filter, { max: 1, time: 60000 });
    let end = false;
    return new Promise(async (resolve) => {
        collector.on("collect", (r) => {
            end = true;
            if (r.emoji.name == "🔀") {
                mensaje.delete();
                resolve(false);
            } else {
                resolve(true);
            }
        });
        collector.on("end", (collected) => {
            if (!end) {
                //finalizó por tiempo
                mensaje.channel.send("Se te acabó el tiempo");
                resolve(true);
            }
        });
    });
}

async function obtenerJugada(canal, message) {
    const filter = (m) => (m.author.id = message.author.id);
    const collector = canal.createMessageCollector(filter, { max: 1, time: 60000 });
    return new Promise(async (resolve) => {
        let end = true;
        collector.on("collect", async (m) => {
            if (m.content.toLowerCase() == 'rendirse') {
                end = false;
                collector.stop();
                resolve({
                    y: 200,
                });
            } else if (m.content.length >= 2) {
                let expresion = /\d|,|!|;|"|'|¿|¡|\?|\*|\+|\||\{|}|\[|]|\(|\)|`|=|\/|\.|-|_|\s/g;
                let cx =
                    m.content
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(expresion, "")
                        .toUpperCase()
                        .charCodeAt(0) - 65;
                let cy = Number.isInteger(Number.parseInt(m.content.substring(1, 2))) ? Number.parseInt(m.content.substring(1, 2)) - 1 : undefined;
                if (cx >= 0 && cy >= 0 && cx <= 8 && cy <= 8) {
                    end = false;
                    let promise = {
                        x: cx,
                        y: cy,
                    };
                    m.delete();
                    collector.stop();
                    resolve(promise);
                } else {
                    end = false;
                    const ms = await canal.send("No son coordenadas validas\nfotmato `[x][y]`");
                    ms.delete({ timeout: 5000 });
                    collector.stop();
                    resolve(false);
                }
            } else {
                end = false;
                const ms = await canal.send("No son coordenadas validas\nfotmato `[x][y]`");
                ms.delete({ timeout: 5000 });
                resolve(false);
            }
        });
        collector.on("end", async (collected) => {
            if (end) {
                //finalizó por tiempo
                const ms = await canal.send("Se te acabó el tiempo");
                ms.delete({ timeout: 5000 });
                resolve({
                    y: 100,
                });
            }
        });
    });
}

function repeat(array, x, y){
    return new Promise(resolve => {
        if(array[x] && array[x][y] && (array[x][y] == 2 || array[x][y] == 3)) {
            resolve(true);
        } else {
            resolve(false);
        }
    })
}