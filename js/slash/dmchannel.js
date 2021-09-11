const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
    name: 'dm',
    data: async ({guild}) => {
        return new Promise(async (resolve) => {
            resolve((new SlashCommandBuilder()
            .setName('dm')
            .setDescription('config dm channel messages')
            .addSubcommand(subcommand => subcommand
                .setName('channel')
                .setDescription('config dm channel messages')
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription('channel where the DMs will be displayed')
                    .setRequired(true)))
            .addSubcommand(subcommand => subcommand
                .setName('deactivate')
                .setDescription('deactivate dm messages')).toJSON()))
        })
    },
    servers: ['825936007449935903', '850338969135611924'],
    run: async (interact) => {
        if (interact.options.getSubcommand() == 'channel') {
            const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: "slash/dm" }).channel;
            if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
                content: lang.permissions,
                ephemeral: true
            });
            const channel = interact.options.getChannel('channel');
            db.collection(interact.guildId).doc("config").update({
                channelDM: channel.id
            }).catch((err) => {
                if (err.details.startsWith("No document to update")) db.collection(interact.guildId).doc("config").set({
                    channelDM: channel.id
                });
            });
            interact.reply({
                content: `${await client.util.replace(lang.reply, [{ match: "{channel}", replace: `\`${channel.name}\`` }])}`
            })
        } else {
            const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: "slash/dm" }).deactivate;
            if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
                content: lang.permissions,
                ephemeral: true
            });
            db.collection(interact.guildId).doc("config").delete();
            interact.reply({
                content: lang.reply
            })
        }
    }
};
