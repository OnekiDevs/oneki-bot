import tools

@tools.bot.group()
async def join(ctx):
    #translations = tools.translations(tools.get_config(ctx), "commands/config/join")
    if (ctx.invoked_subcommand is None):
        await ctx.send("Subcomando invalido...")