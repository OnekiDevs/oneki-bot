const {MessageEmbed} = require('discord.js')
module.exports = (cmdUsage, usageError, errorDesc) => {
    cmdUsage.indexOf(usageError)
    let errorEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Uso incorrecto del comando!')
        .addField('Uso:', '```<> Opcional | [] Obligatorio \n \n' + cmdUsage + '```')

    let usageErrorIndex = cmdUsage.indexOf(usageError)
    let errorStr = '```' + cmdUsage + '\n'
    let checkForError = cmdUsage.includes(usageError, usageErrorIndex)
    if (!checkForError) {
        return;
    }
    for (let i = 0; i < usageErrorIndex; i++) {
        errorStr += ' ';
    }
    let charSplit = usageError.split("")
    for (let i = 0; i < charSplit.length; i++) {
        errorStr += '^'
    }
    errorStr += '```'
    errorEmbed.addField('Error en:', errorStr)
    if (errorDesc) {
        errorEmbed.addField("Descripcion", errorDesc)
    }
    return errorEmbed;
}