const main = () => {
    if (process.argv.length !== 3) {
        console.error(`Usage: node ${__filename} [dev | production]`);
        process.exit(1);
    }
    let [, , dev] = process.argv;
    if (dev == 'dev') dev = true;
    else if (dev == 'production') dev = false;
    else {
        console.error(`Usage: node ${__filename} [dev | production]`);
        process.exit(1);
    }
    require('../scripts/index')(dev);
}
if (module === require.main) main();