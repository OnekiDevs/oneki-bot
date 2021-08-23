import tools
from tools.utils import commands

@tools.bot.group()
@tools.commands.has_permissions(administrator = True)
async def welcome(ctx):
    translations = commands.get_config(ctx, "config/welcome")
    if (ctx.invoked_subcommand is None):
        await ctx.send(translations["invalido"])