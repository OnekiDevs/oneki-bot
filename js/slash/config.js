module.exports = {
    data: {
        name: "config",
        description: "bot settings",
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
                    required: true
                  }
                ]
              },
              {
                type: 1,
                name: "reset",
                description: "reset the prefix"
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
                        value: "en"
                      },
                      {
                        name: "spanish",
                        value: "es"
                      },
                      {
                        name: "french",
                        value: "fr"
                      },
                      {
                        name: "korean",
                        value: "ko"
                      },
                      {
                        name: "rusian",
                        value: "ru"
                      },
                      {
                        name: "chinese",
                        value: "zh"
                      }
                    ]
                  }
                ]
              },
              {
                type: 1,
                name: "reset",
                description: "reset the language"
              }
            ]
          },
          {
            type: 2,
            name: "welcome",
            description: "set up the welcome channel",
            options: [
              {
                type: 1,
                name: "set",
                description: "set up the welcome channel",
                options: [
                  {
                    type: 7,
                    name: "channel",
                    description: "channel where it will show the welcomes"
                  }
                ]
              },
              {
                type: 1,
                name: "delete",
                description: "delete where it will show the welcomes"
              }
            ]
          }
        ]
      },
    servers: 'all',
    run: async (client, interact) => {
        require(`./config/${interact.options.first().name}`)[interact.options.first().options.first().name](client, interact, interact.options.first().options.first().options);
    }
}