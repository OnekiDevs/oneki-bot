module.exports = class Command {

    name = 'ping'
    description = 'ping pong'
    options = []
    defaultPermission = true
    global = true
    server = []

    constructor({name, description, options, defaultPermission, global, servers}) {
        if(name) this.name = name;
        if(description) this.description = description;
        if(options) this.options = options;
        if(defaultPermission) this.default_permission = defaultPermission;
        if(global) this.global = global;
        if(servers) this.servers = servers;
    }

    getData(guild) {
        return new Promise(resolve => resolve({
            name: this.name,
            description: this.description,
            type: 1,
            default_permission: this.defaultPermission,
            options: this.options
        }))
    }

    run(interact){
        interact.reply('pong')
    }

    async deploy(){
        if(this.global) {
            //comando global
            const data = await this.getData()
            client.application.commands.create(data)
        } else if (this.servers.length > 0) {
            //comando privado
            for (const gid of this.servers) {
                const guild = client.guilds.cache.get(gid)
                if(guild) {
                    const data = await this.getData(guild)
                    const command = await guild.commands.create(data)
                    if(!this.defaultPermission) {
                        let permissions = []
                        await Promise.all(guild.roles.cache.filter(r=> r.permissions.has('ADMINISTRATOR')).map(r=>{
                            permissions.push({
                                id: r.id,
                                type: 'ROLE',
                                permission: true
                            })
                        }))
                        command.permissions.add({
                            permissions
                        })
                    }
                }
            }
        } else {
            //comando custom
        }
    }

    get name() {
        return this.name
    }

    get description() {
        return this.description
    }

    get options() {
        return this.options
    }

    get defaultPermission() {
        return this.default_permission
    }

    set name(name) {
        this.name = name
    }

    set description(description) {
        this.description = description
    }

    set options(options) {
        this.options = options
    }

    set defaultPermission(defaultPermission) {
        this.default_permission = defaultPermission
    }

}