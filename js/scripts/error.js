const {MessageEmbed} = require('discord.js')
module.exports = async (error, file) => {
    console.log("\x1b[31m%s\x1b[0m", "*****************************************************************\n", error, "\x1b[31m%s\x1b[0m", "*****************************************************************");
    (await client.channels.fetch("887514182474428446")).send({
        content: process.env.NODE_ENV!=='production'?process.env.DEVELOPER_ID?`<@${process.env.DEVELOPER_ID}>`:null:'<@&887514697690128425>',
        embeds: [
            new MessageEmbed()
                .setColor("YELLOW")
                .setTitle("New Error Detected")
                .addField("Error Type", "```cmd\n" + error.name + "\n```", true)
                .addField("Error Message", "```cmd\n" + error.message + "\n```", true)
                .addField("Error In", '```cmd\n'+file+'\n```', true),
            new MessageEmbed()
                .setColor("YELLOW")
                .setTitle("Error Stack")
                .setDescription(`\`\`\`cmd\n${error.stack}\n\`\`\``),
        ],
    });
}