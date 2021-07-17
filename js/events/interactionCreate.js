module.exports = {
    name: 'interactionCreate',
    run: async (client, interact) => {
        // console.log(interact);
        let cmd = client.slash.get(interact.commandName)??client.buttons.get(interact.customID);
            if (cmd) cmd.run(client, interact, cmd.params);
    }
}