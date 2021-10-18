const db = require("firebase-admin").firestore();
const FieldValue = require("firebase-admin").firestore.FieldValue;
const { Permissions } = require('discord.js');
module.exports = {
    set: async (interact, options) => {
        const lang = util.lang({ lang: client.servers.get(interact.guildId).lang, route: "slash/config" }).suggest.channel;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        const channel = options.getChannel("channel");
        const name = options.getString("alias");
        let obj = {};
        if (name) obj[name] = channel.id;
        else obj["predetermined"] = channel.id;
        db.collection(interact.guildId)
            .doc("suggest")
            .update(obj)
            .catch((err) => {
                if (err.details.startsWith("No document to update"))
                    db.collection(interact.guildId).doc("suggest").set(obj);
            });
        interact.reply({
            content: `${await util.replace(lang.reply, [
                { match: "{channel}", replace: channel.name },
                { match: "{alias}", replace: name??'' }
            ])}`,
            ephemeral: true,
        });
        const sc = client.servers.get(interact.guildId)
        sc.channels.suggest.push(channel.id)
        client.servers.set(interact.guildId, sc)
        channel.send(
            `${await util.replace(lang.send, [
                { match: "{prefix}", replace: client.servers.get(interact.guildId)?.prefix },
                { match: "{channel}", replace: channel.name },
                { match: "{alias}", replace: name },
                { match: "{displayAlias}", replace:name??''}
            ])}`
        );
        interact.guild.commands.create(await client.slash.get('config').data({guild: interact.guildId, client}));
    },
    delete: async (interact, options) => {
        const lang = util.lang({ lang: client.servers.get(interact.guildId).lang, route: "slash/config" }).suggest.delete;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        const channel = options.getString("channel");
        if (channel) {
            let obj = {};
            obj[channel] = FieldValue.delete();
            db.collection(interact.guildId)
                .doc("suggest")
                .update(obj)
                .catch((err) => {
                    if (err.details.startsWith("No document to update"))
                        db.collection(interact.guildId).doc("suggest").set(obj);
                });
            interact.reply({
                content: `${await util.replace(lang.reply, [
                    { match: "{channel}", replace: channel },
                ])}`,
                ephemeral: true
            });

            const sc = client.servers.get(interact.guildId)
            sc.channels.suggest.splice(sc.channels.suggest.indexOf(channel.id), 1);
            client.servers.set(interact.guildId, sc)
            interact.guild.commands.create(await client.slash.get('config').data({guild: interact.guildId, client}));
        } else {
            interact.deferUpdate();
        }
    },
};
