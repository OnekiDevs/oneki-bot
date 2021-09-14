module.exports = {
    name: "join",
    botPermissions: [],
    userPermissions: [],
    alias: ["j"],
    async run(message) {
        util.joinVoice(message)
    }
};
