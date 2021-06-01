module.exports = {
    data: {
        name: "ping",
        description: "ping pong"
    },
    run: async (client, interact) => {
        return new Promise(resolve => {
            try {
                resolve({
                    type: 4, 
                    data: {
                        content: 'pong'
                    }
                });
            } catch (error) {
                throw error;
            }
        });
    }
}