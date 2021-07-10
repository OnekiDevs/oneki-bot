import tools

@tools.bot.group()
async def notes(ctx):
    #translations = tools.utils.translations(tools.get_config(ctx), "commands/notes")
    if (ctx.invoked_subcommand is None):

        await ctx.send("Comando en construcción jaja")