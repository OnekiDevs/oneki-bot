const fetch = require("node-fetch");
module.exports = {
    name: 'guildBanRemove',
    run: async (guild, user) => {
        try {

        } catch (e) {
            util.error(e, `${__dirname}/${__filename}`)
        }
        // fetch('https://koneweb.herokuapp.com/api/unban', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         user: user.id, 
        //         server: guild.id
        //     })
        // }).then(res => res.json())
        // .then(json => console.log(json));
    }
}