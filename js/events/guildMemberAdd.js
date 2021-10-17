const fetch = require("node-fetch");
const db = require("firebase-admin").firestore();
module.exports = {
    name: 'guildMemberAdd',
    run: async (member) => {
        try {

        } catch (e) {
            util.error(e, `${__dirname}/${__filename}`)
        }
        // const snapshot = await db.collection(member.guild.id).doc('bienvenidas').get();
        // if (!snapshot.exists || !snapshot.data()?.channelBans) return;
        // const channel = client.channels.cache.get(snapshot.data().channelBans);
        // fetch(`https://koneweb.herokuapp.com/api/user/${userID}/ban`).then(res => res.json())
        // .then(json => {
        //     if(!json.isBanned) return;
        //     channel.send(`El usuario ${member.displayName} esta baneado de ${json.bansCount} servidores por:\n ${json.bans.join(', ')}`);
        // });
    }
}