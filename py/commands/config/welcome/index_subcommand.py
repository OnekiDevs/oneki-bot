import tools

@tools.bot.group()
@tools.commands.has_permissions(administrator = True)
async def welcome(ctx):
    translations = tools.utils.commands.get_config(ctx, "commands/config/welcome")
    if (ctx.invoked_subcommand is None):
        await ctx.send(translations["invalido"])