module.exports = {
    data: {
        name: "ping",
        description: "ping pong"
    },
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