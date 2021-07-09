import tools

@tools.bot.group()
async def report(ctx):
    translations = tools.translations(tools.get_config(ctx), "commands/report")
    if (ctx.invoked_subcommand is None):
        await ctx.send("Comando en construcción jaja")