import tools
from tools import prefix, times

@tools.bot.event
async def on_ready():
    print("Cargando...")
    tools.bot.command_prefix = prefix.list_prefixes()
    print("Prefijos cargados correctamente")
    tools.serv = prefix.dic_prefixes()
    tools.mutes = times.dic_mutes()
    print("Diccionarios creados correctamente xd")
    #times.mutetime(tools.mutes)
    activity = tools.discord.CustomActivity(f"Escuchando a {len(tools.bot.guilds)} servidores!")
    await tools.bot.change_presence(status = tools.discord.Status.idle, activity = activity)
    print("Estado configurado correctamente")
    print("El bot esta en accion!")
