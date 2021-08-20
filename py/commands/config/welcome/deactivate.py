import tools
from commands.config.welcome import index_subcommand as index

@index.welcome.command()
@tools.commands.has_permissions(administrator = True)
async def deactivate(ctx, etc = None):
    translations = tools.utils.commands.get_config(ctx, "commands/config/welcome")
    message = translations["deactivate"]["defecto"]

    async with ctx.typing():
        document = tools.db.Document(collection = f"{ctx.guild.id}", document = "bienvenidas")
        if(etc == "roles"):
            document.delete("roles")
            message = translations["deactivate"]["roles"]

        elif(etc == "message"):
            document.delete("channel")
            document.delete("message")
            message = translations["deactivate"]["message"]

        else: 
            document.delete()

    await ctx.send(message)