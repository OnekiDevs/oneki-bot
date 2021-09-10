const { Permissions, MessageEmbed } = require("discord.js");
module.exports = {
    name: "command",
    run: async (command, message, args) => {
        if (!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return;
        if (client.servers.get(message.guild.id).blacklist.channels.includes(message.channel.id)) return;   
        const cmd = client.commands.find((c) => c.name.toLowerCase() == command || c.alias.includes(command));
        if (cmd) {
            const server = client.servers.get(message.guild.id);

            const lang = client.util.lang({ lang: server.lang, route: "events/command" });
            if (cmd.userPermissions?.length > 0 && !message.member.permissions.has(cmd.userPermissions)) return;
            if (cmd.botPermissions?.length > 0 && !message.guild.me.permissions.has(cmd.botPermissions))
                return message.reply(
                    await client.util.replace(lang.botPermissions, [
                        {
                            match: "{permissions}",
                            replace: `\`${new Permissions(cmd.botPermissions).toArray().join("` `")}\``,
                        },
                    ])
                );
            cmd.run(message, args).catch(async (error) => {
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
                            .addField("Error In", `\`\`\`cmd\ncommand ${cmd.name}\n\`\`\``, true),
                        new MessageEmbed()
                            .setColor("YELLOW")
                            .setTitle("Error Stack")
                            .setDescription(`\`\`\`cmd\n${error.stack}\n\`\`\``),
                    ],
                });
            });
        }
    },
};
