import tools
from tools.utils import commands
from commands.config.channel import index_subcommand as index

@index.channel.command()
@tools.commands.has_permissions(administrator = True)
async def report(ctx, channel: tools.discord.TextChannel):
    translations = commands.get_config(ctx, "report")
    async with ctx.typing():
        document = tools.db.Document(collection = f"{ctx.guild.id}", document = "report")

        if document.exists:
            document.update("channel", f"{channel.id}")
        else:
            document.set(channel = f"{channel.id}")

        if document.exist:
            document.update("channel", f"{channel.id}") 
        else: 
            document.set(channel = f"{channel.id}") 

    await ctx.send(translations['channel_config'])
