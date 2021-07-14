import tools
from tools import times

@tools.bot.event
async def on_ready():
    collection = tools.db.ctx("config")
    print("[*] Cargando...")
    tools.bot.command_prefix = collection.get("bot", "prefixes")
    tools.servers = tools.utils.dict_servers(tools.bot, collection)
    #tools.mutes = times.dic_mutes()
    #times.mutetime(tools.mutes)
    tools.utils.socket_send("prefix", 5646, "a")
    activity = tools.discord.Activity(type = tools.discord.ActivityType.watching, name = f"a {len(tools.bot.guilds)} servidores")
    await tools.bot.change_presence(status = tools.discord.Status.idle, activity = activity)
    print("[+] El bot esta en accion!")
