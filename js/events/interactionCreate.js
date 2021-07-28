module.exports = {
    name: 'interactionCreate',
    run: async (client, interact) => {
        let cmd = client.slash.get(interact.commandName)??client.buttons.get(interact.customId);
        if (cmd) cmd.run(client, interact, cmd.params);
    }
}