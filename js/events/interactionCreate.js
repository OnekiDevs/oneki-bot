module.exports = {
    name: 'interactionCreate',
    run: async (interact) => {
        try {
            // console.log(interact);
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
        } catch (error) {
            console.log(
                "\x1b[31m%s\x1b[0m",
                "**********************************************************************"
            );
            console.log(error);
            console.log(
                "\x1b[31m%s\x1b[0m",
                "**********************************************************************"
            );
            (await client.channels.fetch("833780614712131616")).send({
                content: process.env.NODE_ENV!='production'?process.env.DEVELOPER_ID?`<@${process.env.DEVELOPER_ID}>`:null:'<@&832657759081463848>',
                embeds: [
                    new MessageEmbed()
                        .setColor("YELLOW")
                        .setTitle("New Error Detected")
                        .addField("Error Type", "```cmd\n" + error.name + "\n```", true)
                        .addField("Error Message", "```cmd\n" + error.message + "\n```", true)
                        .addField("Error In", `\`\`\`cmd\n${interact.isButton()?`button ${interact.customId}`:interact.isCommand()?`command /${interact.name}`:'event interactionCreate'}\n\`\`\``, true),
                    new MessageEmbed()
                        .setColor("YELLOW")
                        .setTitle("Error Stack")
                        .setDescription(`\`\`\`cmd\n${error.stack}\n\`\`\``),
                ],
            });
        }
    }
}