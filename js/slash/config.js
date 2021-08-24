const db = require('firebase-admin').firestore();
module.exports = {
    name: 'config',
    data: async ({guild, client}) => {
        let suggestChannels = await db.collection(guild??"").doc('suggest').get();
        if (suggestChannels.exists) {
            suggestChannels = [
                {
                    type: 3,
                    name: "channel",
                    description: "channel to establish",
                    required: true,
                    choices: Object.keys(suggestChannels.data()).filter(i => i != 'lastId').map(i => {
                        return { 
                            name: i,
                            value: i
                        }
                    })
                }
            ]
        } else {
            suggestChannels = []
        }
        let removeChannels = await db.collection('config').doc(guild??"").get();
        if (removeChannels.exists && removeChannels.data().blacklistChannels) {
            removeChannels = [
                { 
                    type: 'CHANNEL',
                    name: 'add',
                    description: 'add the channel to the blacklist'
                },
                {
                    type: 'STRING',
                    name: "remove",
                    description: "remove the channel to the blacklist",
                    required: true,
                    choices: removeChannels.data().blacklistChannels.map(i => {
                        const channel = client.channels.cache.get(i)
                        if (channel) return { name: channel.name, value: i }
                        else return false
                    }).filter(i=>i)
                }
            ]
        } else {
            removeChannels = [
                { 
                    type: 'CHANNEL',
                    name: 'add',
                    description: 'add the channel to the blacklist'
                }
            ]
        }
        return new Promise((resolve, reject) => {
            resolve({
                name: "config",
                description: "bot settings",
                type: 1,
                options: [
                    {
                        type: 2,
                        name: "prefix",
                        description: "set bot prefix",
                        options: [
                            {
                                type: 1,
                                name: "set",
                                description: "set the new bot prefix",
                                options: [
                                    {
                                        type: 3,
                                        name: "prefix",
                                        description: "new prefix",
                                        required: true,
                                    },
                                ],
                            },
                            {
                                type: 1,
                                name: "reset",
                                description: "reset the prefix",
                            },
                        ],
                    },
                    {
                        type: 2,
                        name: "blacklist",
                        description: "config blacklists",
                        options: [
                            { 
                                type: 1,
                                name: "channels",
                                description: "config channels blacklists",
                                options: removeChannels
                            }
                        ]
                    },
                    {
                        type: 2,
                        name: "language",
                        description: "set the server language",
                        options: [
                            {
                                type: 1,
                                name: "set",
                                description: "set the server language",
                                options: [
                                    {
                                        type: 3,
                                        name: "language",
                                        description: "new server language",
                                        required: true,
                                        choices: [
                                            {
                                                name: "english",
                                                value: "en",
                                            },
                                            {
                                                name: "spanish",
                                                value: "es",
                                            },
                                            // {
                                            //     name: "french",
                                            //     value: "fr",
                                            // },
                                            // {
                                            //     name: "korean",
                                            //     value: "ko",
                                            // },
                                            // {
                                            //     name: "rusian",
                                            //     value: "ru",
                                            // },
                                            // {
                                            //     name: "chinese",
                                            //     value: "zh",
                                            // },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: 1,
                                name: "reset",
                                description: "reset the language",
                            },
                        ],
                    },
                    {
                        type: 2,
                        name: "welcome",
                        description: "set up the welcome channel",
                        options: [
                            {
                                type: 1,
                                name: "channel",
                                description: "set up the welcome channel",
                                options: [
                                    {
                                        type: 7,
                                        name: "channel",
                                        required: true,
                                        description: "channel where it will show the welcomes",
                                    },
                                ],
                            },
                            {
                                type: 1,
                                name: "rols",
                                description: "set up the welcome rol",
                                options: [
                                    {
                                        type: 8,
                                        name: "rol",
                                        required: true,
                                        description: "role that will be given to the user upon joining",
                                    },
                                ],
                            },
                            {
                                type: 1,
                                name: "deactivate",
                                description: "disable a welcome feature",
                                options: [
                                    {
                                        type: 3,
                                        name: "function",
                                        description: "function to deactivate",
                                        required: true,
                                        choices: [
                                            {
                                                name: "welcome",
                                                value: "welcome",
                                            },
                                            {
                                                name: "rol",
                                                value: "rol",
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 2,
                        name: "suggest",
                        description: "configure suggestions",
                        options: [
                            {
                                type: 1,
                                name: "set",
                                description: "set up suggestion channels", 
                                options: [
                                    {
                                        type: 7,
                                        name: "channel",
                                        description: "channel to establish",
                                        required: true
                                    },
                                    {
                                        type: 3,
                                        name: "alias",
                                        description: "channel alias"
                                    }
                                ]
                            },
                            {
                                type: 1,
                                name: "delete",
                                description: "delete suggestion channels",
                                options: suggestChannels
                            }
                        ]
                    },
                    {
                        type: 2,
                        name: "edited",
                        description: "configure edited messages",
                        options: [
                            {
                                type: 1,
                                name: "channel",
                                description: "set the channel where you will see the edited messages", 
                                options: [
                                    {
                                        type: 7,
                                        name: "channel",
                                        description: "channel to establish",
                                        required: true
                                    }
                                ]
                            },
                            {
                                type: 1,
                                name: "reset",
                                description: "disable view edited messages",
                            }
                        ]
                    },
                    {
                        type: 2,
                        name: "deleted",
                        description: "configure deleted messages",
                        options: [
                            {
                                type: 1,
                                name: "channel",
                                description: "set the channel where you will see the deleted messages", 
                                options: [
                                    {
                                        type: 7,
                                        name: "channel",
                                        description: "channel to establish",
                                        required: true
                                    }
                                ]
                            },
                            {
                                type: 1,
                                name: "reset",
                                description: "disable view deleted messages",
                            }
                        ]
                    }
                ],
            })
        });
    },
    servers: [],
    run: async (client, interact) => {
        require(`./config/${interact.options.getSubcommandGroup()}`)[interact.options.getSubcommand()](
            client,
            interact,
            interact.options
        );
    },
};
