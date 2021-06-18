import tools
from tools import prefix

@tools.bot.event
async def on_ready():
    print("Cargando...")
    tools.bot.command_prefix = prefix.getting_prefixes()
    print("Prefijos cargados correctamente")
    game = tools.discord.Game(f"Escuchar {len(tools.bot.guilds)} servidores!")
    await tools.bot.change_presence(status = tools.discord.Status.idle, activity = game)
    print("Estado configurado correctamente")
    print("El bot esta en accion!")
