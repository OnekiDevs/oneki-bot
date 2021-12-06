module.exports = {
    name: 'lang',
    run: async (req) => {
        try {
            if(client.servers.has(req.server)) client.servers.get(req.server).prefix = req.prefix;
        }  catch (e) {
            util.error(e, __filename)
        }
    }
}
