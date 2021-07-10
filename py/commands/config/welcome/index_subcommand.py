import tools

@tools.bot.group()
async def welcome(ctx):
    translations = tools.utils.translations(tools.get_config(ctx), "commands/config/welcome")
    if (ctx.invoked_subcommand is None):
        await ctx.send(translations["invalido"])