module.exports.run = async (client, interact, params) => {
    interact.deferUpdate();
    if (interact.user.id == interact.message.author.id) interact.message.delete();
}
module.exports.id = 'clear_no';