module.exports = {
    name: 'interaction',
    run: async (client, interact) => {
        // console.log(interact);
        let cmd = client.slash.get(interact.commandName)??client.buttons.get(interact.customID);
            if (cmd) cmd.run(client, interact, cmd.params);
            else if ((/uno_in_.{9}/g).test(interact.customID)) require('../modules/uno').ingresar(client, interact);
            else if ((/uno_co_.{9}/g).test(interact.customID)) require('../modules/uno').comenzar(client, interact);
            else if ((/uno_mo_.{9}/g).test(interact.customID)) require('../modules/uno').mostrar(client, interact);
            else if ((/uno_ea_.{9}/g).test(interact.customID)) require('../modules/uno').comer(client, interact);
            else if ((/uno_.{2}_.{9}/g).test(interact.customID)) require('../modules/uno').jugada(client, interact);
    }
}