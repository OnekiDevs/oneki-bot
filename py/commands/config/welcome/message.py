import tools
from commands.config.welcome import index_subcommand as index

@index.welcome.command()
@tools.commands.has_permissions(administrator = True)
async def message(ctx, channel : index.tools.discord.TextChannel, *, message):
    translations = tools.utils.commands.get_config(ctx, "commands/config/welcome")

    async with ctx.typing():
        document = tools.db.Document(collection = f"{ctx.guild.id}", document = "bienvenidas")

        if document.exists:
            document.update("channel", f"{channel.id}")
            document.update("message", message)

        else: 
            document.set(channel = f"{channel.id}", message = message)

    await ctx.send(translations["message"])