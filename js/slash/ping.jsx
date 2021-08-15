module.exports = {
    name: 'ping',
    data: () => {
        return {
            name: "ping",
            description: "ping pong"
        }
    },
    servers: [],
    run: async (client, interact) => {
        interact.reply({
            content: 'pong!'
        });
    }
}