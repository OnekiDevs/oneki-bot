const fetch = require("node-fetch");
module.exports = {
    name: 'guildBanAdd',
    run: async (client, guild, user) => {
        // fetch('https://koneweb.herokuapp.com/api/ban', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         user: user.id, 
        //         server: guild.id
        //     })
        // }).then(res => res.json())
        // .then(json => console.log(json))
    }
}