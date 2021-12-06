module.exports = class Command {

    name = ''
    aliases = []
    permissions = {
        bot: [],
        member: []
    }
    cooldown = 0
    args = []

    constructor({name, aliases, permissions, cooldown, args}) {
        this.name = name
        this.aliases = aliases
        this.permissions = permissions
        this.cooldown = cooldown
        this.args = args
    }

    /**
     * Valid the arguments
     * @param content: string
     * @param prefix: string
     * @returns {Promise<array<string>>>}
     */
    checkArguments(content, prefix) {
        return new Promise((resolve, reject)=> {
            if(!this.args) {
                resolve( content.slice(prefix.length).trim().split(/ +/g).slice(1))
            }
        })
    }

    /**
     * Check if the member has the required permissions
     * @param member: DiscordMember
     * @returns {Promise<boolean>}
     */
    checkMemberPermissions(member) {
        return new Promise((resolve, reject) => {
            if(this.permissions.member.length===0) resolve(true)
            else if(member.permissions.has(this.permissions.member)) resolve(true)
            else reject(`necesitas: \`${this.permissions.member.join('` `')}\``) //TODO traduccion
        })
    }

    /**
     * Check if the bot has the required permissions
     * @param memberBot: DiscordmemberBot
     * @returns {Promise<boolean>}
     */
    checkBotPermissions(memberBot) {
        return new Promise((resolve, reject) => {
            if(this.permissions.bot.length===0) resolve(true)
            else if(memberBot.permissions.has(this.permissions.bot)) resolve(true)
            else reject(`nesesito: \`${this.permissions.bot.join('` `')}\``)
        })
    }

    /**
     * execute the command
     * @param message: DiscordJSMessage
     * @param args: array<string>
     */
    run(message, args = []){
        message.reply(`${this.name} command executed`);
    }

    /**
     * Check if is the command
     * @param input: string
     * @returns {boolean}
     */
    checkCommand(command){
        return command === this.name.toLowerCase() || this.aliases.includes(command)
    }

}