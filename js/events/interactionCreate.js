module.exports = {
    name: 'interactionCreate',
    run: async (client, interact) => {
        // console.log(interact);
        if(interact.isButton()) {
            if (interact.customId.startsWith('help_')) {
                let cmd = client.buttons.get('help');
                cmd.run(client, interact, {
                    category: interact.customId.split('_')[2],
                    lang: interact.customId.split('_')[1]
                })
            } else {
                let cmd = client.buttons.get(interact.customId);
                if (cmd) cmd.run(client, interact)
            }
        } else if (interact.isCommand()){
            let cmd = client.slash.get(interact.commandName)
            if (cmd) cmd.run(client, interact)
        }
    }
}