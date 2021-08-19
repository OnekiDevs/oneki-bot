import tools
from tools.utils import commands

@tools.bot.group()
@tools.commands.has_permissions(administrator = True)
async def channel(ctx):
    #translations = tools.utils.translations(index.commands.get_config(ctx), "commands/report")
    if ctx.invoked_subcommand is None:
        await ctx.send("Subcomando invalido")