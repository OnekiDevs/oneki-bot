module.exports = {
    name: 'interactionCreate',
    run: async (interact) => {
        try {
            if(interact.isButton()) {
                if (interact.customId.startsWith('help_')) {
                    let cmd = client.buttons.get('help');
                    cmd.run(interact, {
                        category: interact.customId.split('_')[2],
                        lang: interact.customId.split('_')[1]
                    })
                } else if(interact.customId.startsWith('poll_')) {
                    client.buttons.get('poll').run(interact, {
                        id: interact.customId.split('_')[1],
                        option: interact.customId.replace(/poll_.{9}_/,'')
                    })
                } else {
                    let cmd = client.buttons.get(interact.customId);
                    if (cmd) cmd.run(interact, cmd.params)
                }
            } else if (interact.isCommand()){
                let cmd = client.slash.get(interact.commandName)
                if (cmd) cmd.run(interact)
            }
        }  catch (e) {
            util.error(e, `${__dirname}/${__filename}`)
        }
    }
}