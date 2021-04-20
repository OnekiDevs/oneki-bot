const main = () => {

    //revisamos que tenga los parametros nesesarios
    if (process.argv.length !== 3) {
        console.error(`Usage: node ${__filename} [dev | production]`);
        process.exit(1);
    }
    //obtenemos el nesesario
    let [, , dev] = process.argv;
    //revisamos si es lo que requiere
    if (dev == 'dev') {
        dev = true
    } else if (dev == 'production') {
        dev = false
    }else {
        console.error(`Usage: node ${__filename} [dev | production]`);
        process.exit(1);
    }
    //ejecutamos el bot
    require('../modules/index')(dev)

}

if (module === require.main) {
    main();
}