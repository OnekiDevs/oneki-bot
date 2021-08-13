const db = require("firebase-admin").firestore();
const FieldValue = require("firebase-admin").firestore.FieldValue;
const { Permissions } = require('discord.js');
module.exports = {
    channel: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: "slash/config" }).suggest.channel;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        const channel = options.get("channel");
        const name = options.get("name");
        let obj = {};
        if (name) obj[name.value] = channel.value;
        else obj["predetermined"] = channel.value;
        db.collection(interact.guildId)
            .doc("suggest")
            .update(obj)
            .catch((err) => {
                if (err.details.startsWith("No document to update"))
                    db.collection(interact.guildId).doc("suggest").set(obj);
            });
        interact.reply({
            content: `${await client.utiles.replace(lang.reply, [
                { match: "prefix", replace: client.servers.get(interact.guildId)?.prefix },
                { match: "alias", replace: name.value },
                { match: "displayAlias", replace: `${name ? `${name.value} ` : ""}` },
            ])}`,
            ephemeral: true,
        });
        channel.channel.send(
            `${await client.utiles.replace(lang.send, [
                { match: "prefix", replace: client.servers.get(interact.guildId)?.prefix },
                { match: "channel", replace: channel.channel.name },
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
        const channel = options.get("channel");
        if (channel) {
            let obj = {};
            obj[channel.value] = FieldValue.delete();
            db.collection(interact.guildId)
                .doc("suggest")
                .update(obj)
                .catch((err) => {
                    if (err.details.startsWith("No document to update"))
                        db.collection(interact.guildId).doc("suggest").set(obj);
                });
            interact.reply({
                content: `${await client.utiles.replace(lang.reply, [
                    { match: "channel", replace: channel.value },
                ])}`
            });
        } else {
            interact.deferUpdate();
        }
    },
};
