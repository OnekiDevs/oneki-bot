module.exports = {
    name: 'interaction',
    run: async (client, interact) => {
        // console.log(interact);
        let cmd = client.slash.get(interact.commandName)??client.buttons.get(interact.customID);
            if (cmd) cmd.run(client, interact, cmd.params);
            else if ((/uno_i_.{9}/g).test(interact.customID)) require('../modules/uno').ingresar(client, interact);
            else if ((/uno_c_.{9}/g).test(interact.customID)) require('../modules/uno').comenzar(client, interact);
            else if ((/uno_m_.{9}/g).test(interact.customID)) require('../modules/uno').mostrar(client, interact);
            else if ((/uno_e_.{9}/g).test(interact.customID)) require('../modules/uno').comer(client, interact);
    }
}