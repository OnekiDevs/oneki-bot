require("dotenv").config();

const one = ({name, token, id}) => {
    const interactions = require("discord-slash-commands-client");
    const client = new interactions.Client(token, id);
    let check = false;
    client.getCommands().then(async (commands) => {
        for (const command of commands) {
            if (command.name == name) client.deleteCommand(command.id).then(console.log('Eliminado', command.name)).catch(console.error);
        }
    }).catch(console.error);
    if (!check) console.log('No se encontro el slash '+name);
}

const main = () => {

    //revisamos que tenga los parametros nesesarios
    if (process.argv.length !== 4) {
        console.error(`Usage: node ${__filename} [dev | production] [command Name]`);
        process.exit(1);
    }
    //obtenemos el nesesario
    let [, , dev, name] = process.argv;
    //revisamos si es lo que requiere
    if (dev == 'dev') {
        dev = true
    } else if (dev == 'production') {
        dev = false
    }else {
        console.error(`Usage: node ${__filename} [dev | production] [command Name]`);
        process.exit(1);
    }
    if (!name) {
        console.error(`Usage: node ${__filename} [dev | production] [command Name]`);
        process.exit(1);
    }
    //ejecutamos el bot
    try {
        one({
            token: dev?process.env.TOKEN_DISCORD_DEV:process.env.TOKEN_DISCORD,
            id: dev?process.env.BOT_ID_DEV:process.env.BOT_ID,
            name
        })
    } catch (error) {
        console.log(error);
    }

}

if (module === require.main) {
    main();
}