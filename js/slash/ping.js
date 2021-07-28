module.exports = {
    name: 'ping',
    data: () => {
        return {
            name: "ping",
            description: "ping pong"
        }
    },
    servers: 'all',
    run: async (client, interact) => {
        client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 4, 
                data: {
                    content: 'pong'
                }
            }
        });
    }
}