const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'config',
    async data({guild}) {
        return new Promise(async resolve => {
            let guildConfig = await db.collection('config').doc(guild??"").get();
            let suggestChannels = await db.collection(guild??"").doc('suggest').get();
            resolve((new SlashCommandBuilder().setName('config').setDescription('bot settings').setDefaultPermission(true).addSubcommandGroup(subcommandGroup => {
                return subcommandGroup.setName('prefix').setDescription('set bot prefix').addSubcommand(subcommand => {
                    return subcommand.setName('set').setDescription('set the new bot prefix').addStringOption(option => {
                        return option.setName('prefix').setDescription('new prefix').setRequired(true)
                    })
                }).addSubcommand(subcommand => {
                    return subcommand.setName('reset').setDescription('reset the prefix')
                })
            }).addSubcommandGroup(subcommandGroup => {
                return subcommandGroup.setName('blacklist').setDescription('config blacklists').addSubcommand(subcommand => {
                    subcommand.setName('channels').setDescription('config channels blacklists').addChannelOption(option => {
                        return option.setName('add').setDescription('add the channel to the blacklist')
                    })
                    if (guildConfig.exists && guildConfig.data().blacklistChannels && guildConfig.data().blacklistChannels.length > 0) subcommand.addStringOption(option => {
                        option.setName('remove').setDescription('remove the channel to the blacklist')
                        for (const channelId of guildConfig.data().blacklistChannels) {
                            const channelName = client.channels.cache.get(channelId)?.name
                            if (channelName) option.addChoice(channelName, channelId)
                        }
                        return option
                    })
                    return subcommand
                })
            }).addSubcommandGroup(subcommandGroup => {
                return subcommandGroup.setName('language').setDescription('set the server language').addSubcommand(subcommand => {
                    return subcommand.setName('set').setDescription('set the server language').addStringOption(option => {
                        return option.setName('language').setDescription('new server language').addChoice('english', 'en').addChoice('spanish', 'es')
                    })
                }).addSubcommand(subcommand => {
                    return subcommand.setName('reset').setDescription('reset the language')
                })
            }).addSubcommandGroup(subcommandGroup => {
                return subcommandGroup.setName('welcome').setDescription('set up the welcome channel').addSubcommand(subcommand => {
                    return subcommand.setName('channel').setDescription('set up the welcome channel').addChannelOption(option => {
                        return option.setName('channel').setDescription('channel where it will show the welcomes').setRequired(true)
                    }).addStringOption(option => {
                        return option.setName('message').setDescription('message to sow')
                    })
                }).addSubcommand(subcommand => {
                    return subcommand.setName('rols').setDescription('set up the welcome rol').addRoleOption(option => {
                        return option.setName('rol').setDescription('role that will be given to the user upon joining').setRequired(true)
                    })
                }).addSubcommand(subcommand => {
                    return subcommand.setName('deactivate').setDescription('disable a welcome feature').addStringOption(option => {
                        return option.setName('function').setDescription('function to deactivate').setRequired(true).addChoice('welcome', 'welcome').addChoice('rolls', 'rolls')
                    })
                })
            }).addSubcommandGroup(subcommandGroup => {
                subcommandGroup.setName('suggest').setDescription('configure suggestions').addSubcommand(subcommand => {
                    return subcommand.setName('set').setDescription('set up suggestion channels').addChannelOption(option => {
                        return option.setName('channel').setDescription('channel to establish').setRequired(true)
                    }).addStringOption(option => {
                        return option.setName('alias').setDescription('channel alias')
                    })
                })
                if (suggestChannels.exists) subcommandGroup.addSubcommand(subcommand => {
                    return subcommand.setName('delete').setDescription('delete suggestion channels').addStringOption(option => {
                        option.setName('channel').setDescription('channel to delete')
                        Object.keys(suggestChannels.data()).filter(i => i !== 'lastId').map(i => {
                            option.addChoice(i,i)
                        })
                        return option
                    })
                })
                return subcommandGroup
            }).addSubcommandGroup(subcommandGroup => {
                return subcommandGroup.setName('edited').setDescription('configure edited messages').addSubcommand(subcommand => {
                    return subcommand.setName('channel').setDescription('set the channel where you will see the edited messages').addChannelOption(option => {
                        return option.setName('channel').setDescription('channel to establish').setRequired(true)
                    })
                }).addSubcommand(subcommand => {
                    return subcommand.setName('reset').setDescription('disable view edited messages')
                })
            }).addSubcommandGroup(subcommandGroup => subcommandGroup
                .setName('deleted').setDescription('configure deleted messages')
                .addSubcommand(subcommand => subcommand
                    .setName('channel').setDescription('set the channel where you will see the deleted messages')
                    .addChannelOption(option => option.setName('channel').setDescription('channel to establish').setRequired(true)))
                .addSubcommand(subcommand => subcommand
                    .setName('reset').setDescription('disable view deleted messages'))).addSubcommandGroup(subcommandGroup => subcommandGroup
                .setName('attachments').setDescription('configure attachments channel')
                .addSubcommand(subcommand => subcommand
                    .setName('channel').setDescription('configure attachments channel')
                    .addChannelOption(option => option.setName('channel').setDescription('channel where the attachments are send').setRequired(true)))
                .addSubcommand(subcommand => subcommand
                    .setName('reset').setDescription('deactivate attachments channel')))
                .addSubcommandGroup(subcommandGroup => subcommandGroup
                .setName('pings').setDescription('config pings')
                .addSubcommand(subcommand => subcommand
                    .setName('add_youtube').setDescription('config youtube pings')
                    .addChannelOption(option => option.setName('channel').setDescription('channel where the pings will be sent').setRequired(true))
                    .addStringOption(option => option.setName('yt_channel').setDescription('id of the channel').setRequired(true)))
            )).toJSON())
        })
    },
    servers: [],
    global: true,
    run: async (interact) => {
        try {
            require(`./config/${interact.options.getSubcommandGroup()}`)[interact.options.getSubcommand()](
                interact,
                interact.options
            );
        } catch (e) {
            throw e
        }
    },
};
