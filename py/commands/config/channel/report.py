import tools
from commands.config.channel import index_subcommand as index

@index.channel.command()
async def report(ctx, channel: tools.discord.TextChannel):
    #translations = tools.utils.translations(index.commands.get_config(ctx), "commands/report")
    async with ctx.typing():
        document = tools.db.Document(collection = f"{ctx.guild.id}", document = "report")
        if document.exists:
            document.update("channel", f"{channel.id}")

        else:
            document.set(channel = f"{channel.id}")

    await ctx.send("Canal de reportes configurado correctamente!")