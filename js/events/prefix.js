module.exports = {
    name: 'prefix',
    run: async (req) => {
        try {
            if(client.servers.has(req.server)) client.servers.get(req.server).lang = req.lang;
        }  catch (e) {
            util.error(e, __filename)
        }
    }
}
