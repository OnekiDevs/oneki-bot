import tools

@tools.bot.event
async def on_ready():
    collection = tools.db.Collection(collection = "config") 
    print("[*] Cargando...")

    tools.bot.command_prefix = collection.document("bot").content["prefixes"]
    tools.servers = tools.utils.dict_servers()

    # tools.client.connect(tools.servers)

    activity = tools.discord.Activity(type = tools.discord.ActivityType.watching, name = f"{len(tools.bot.guilds)} servidores")
    await tools.bot.change_presence(status = tools.discord.Status.idle, activity = activity)

    print("[+] El bot esta en accion!")