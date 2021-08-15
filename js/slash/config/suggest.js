const db = require("firebase-admin").firestore();
const FieldValue = require("firebase-admin").firestore.FieldValue;
const { Permissions } = require('discord.js');
module.exports = {
    set: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: "slash/config" }).suggest.channel;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        const channel = options.getChannel("channel");
        const name = options.getString("alias");
        console.log(channel);
        let obj = {};
        if (name) obj[name.value] = channel.id;
        else obj["predetermined"] = channel.id;
        db.collection(interact.guildId)
            .doc("suggest")
            .update(obj)
            .catch((err) => {
                if (err.details.startsWith("No document to update"))
                    db.collection(interact.guildId).doc("suggest").set(obj);
            });
        interact.reply({
            content: `${await client.util.replace(lang.reply, [
                { match: "prefix", replace: client.servers.get(interact.guildId)?.prefix },
                { match: "alias", replace: name?name.value:'' },
                { match: "displayAlias", replace: `${name ? `${name.value} ` : ""}` },
            ])}`,
            ephemeral: true,
        });
        channel.send(
            `${await client.util.replace(lang.send, [
                { match: "prefix", replace: client.servers.get(interact.guildId)?.prefix },
                { match: "channel", replace: channel.name },
                { match: "alias", replace: name.value },
            ])}`
        );
    },
    delete: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: "slash/config" }).suggest.delete;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        const channel = options.getChannel("channel");
        if (channel) {
            let obj = {};
            obj[channel.id] = FieldValue.delete();
            db.collection(interact.guildId)
                .doc("suggest")
                .update(obj)
                .catch((err) => {
                    if (err.details.startsWith("No document to update"))
                        db.collection(interact.guildId).doc("suggest").set(obj);
                });
            interact.reply({
                content: `${await client.util.replace(lang.reply, [
                    { match: "channel", replace: channel.id },
                ])}`
            });
        } else {
            interact.deferUpdate();
        }
    },
};
