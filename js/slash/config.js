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
                        key: "ChoiceOption-1627275541615",
                        name: "english",
                        value: "en"
                      },
                      {
                        key: "ChoiceOption-1627275603389",
                        name: "spanish",
                        value: "es"
                      },
                      {
                        key: "ChoiceOption-1627275617176",
                        name: "french",
                        value: "fr"
                      },
                      {
                        key: "ChoiceOption-1627275723822",
                        name: "korean",
                        value: "ko"
                      },
                      {
                        key: "ChoiceOption-1627275758681",
                        name: "rusian",
                        value: "ru"
                      },
                      {
                        key: "ChoiceOption-1627275769461",
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
          }
        ]
      },
    servers: 'all',
    run: async (client, interact) => {
        require(`./config/${interact.options.first().name}`)[interact.options.first().options.first().name](client, interact, interact.options.first().options.first().options);
    }
}