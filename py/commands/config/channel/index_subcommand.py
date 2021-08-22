import tools
from tools.utils import commands

@tools.bot.group()
@tools.commands.has_permissions(administrator = True)
async def channel(ctx):
    translations = commands.get_config(ctx, "report")
    if ctx.invoked_subcommand is None:
        await ctx.send(translations['invalid_subcommand'])