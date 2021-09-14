const { Permissions, MessageEmbed } = require("discord.js");
module.exports = {
    name: "command",
    run: async (command, message, args) => {
        const server = client.servers.get(message.guild.id);
        if (server.blacklist.channels.includes(message.channel.id)) return;
        const cmd = client.commands.find(c=>c.checkCommand(command));
        if (cmd) cmd.checkMemberPermissions(message.member).then(()=>{
            cmd.checkBotPermissions(message.guild.me).then(()=>{
                cmd.run(message, args).catch(async (error) => {
                    console.log("\x1b[31m%s\x1b[0m", "*****************************************************************\n", error, "\x1b[31m%s\x1b[0m", "*****************************************************************");
                    (await client.channels.fetch("885674115615301651")).send({
                        content: process.env.NODE_ENV!='production'?process.env.DEVELOPER_ID?`<@${process.env.DEVELOPER_ID}>`:null:'<@&885674114663211038>',
                        embeds: [
                            new MessageEmbed()
                                .setColor("YELLOW")
                                .setTitle("New Error Detected")
                                .addField("Error Type", "```cmd\n" + error.name + "\n```", true)
                                .addField("Error Message", "```cmd\n" + error.message + "\n```", true)
                                .addField("Error In", `\`\`\`cmd\ncommand ${cmd.name}\n\`\`\``, true),
                            new MessageEmbed()
                                .setColor("YELLOW")
                                .setTitle("Error Stack")
                                .setDescription(`\`\`\`cmd\n${error.stack}\n\`\`\``),
                        ],
                    });
                })
            }).catch(msg=>message.reply(msg))
        }).catch(msg=>message.reply(msg))
    }
}
