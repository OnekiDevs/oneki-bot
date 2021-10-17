module.exports.run = async (interact, params) => {
    const message = await interact.message.channel.messages.fetch(interact.message.reference.messageId)
    interact.deferUpdate();
    if (interact.member.id == message.member.id) {
        let canal = await interact.message.channel.clone();
        canal.setPosition(interact.message.channel.position);
        interact.message.channel.delete();
    }
}
module.exports.id = 'clear_yes';