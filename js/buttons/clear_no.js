module.exports.run = async (interact, params) => {
    const message = await interact.message.channel.messages.fetch(interact.message.reference.messageId)
    if (interact.member.id == message.member.id) {
        interact.message.delete();
        message.delete();
    }
    interact.deferUpdate();
}
module.exports.id = 'clear_no';