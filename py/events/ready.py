import tools

@tools.bot.event
async def on_ready():
    tools.bot.command_prefix = tools.db.ctx("config").get("bot", "prefix")
    print("El bot en py esta acción!")
