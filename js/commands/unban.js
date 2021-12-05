module.exports = class Unban extends require('../classes/OldCommand'){

    constructor() {
        super({
            name: 'unban',
            aliases: [],
            permissions: {
                bot: ['BAN_MEMBERS'],
                member: ['BAN_MEMBERS']
            },
            cooldown: 0,
            args: []
        })

    }

    run(message, args) {
        const server = client.servers.get(message.guild.id);
        const lang = util.lang({lang:server.lang, route:'commands/unban'});
        if (!message.member.permissions.has(['BAN_MEMBERS'])) {
            message.reply(lang.permissions);
            return;
        }
        const userToUnbanID = args[0];
        if (!userToUnbanID) return;
        message.guild.members.unban(userToUnbanID);
        return message.reply(lang.ready);
    }

}