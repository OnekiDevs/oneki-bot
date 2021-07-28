from commands.config.welcome import index_subcommand as index

@index.welcome.command()
@index.tools.commands.has_permissions(administrator = True)
async def deactivate(ctx, etc = None):
    translations = index.tools.utils.translations(index.tools.get_config(ctx), "commands/config/welcome")
    message = translations["deactivate"]["defecto"]

    async with ctx.typing():
        document = index.tools.db.Document(collection = f"{ctx.guild.id}", document = "bienvenidas")
        if(etc == "roles"):
            # index.tools.db.ctx(f"{ctx.guild.id}").delete("bienvenidas", "roles")
            document.delete("roles")
            message = translations["deactivate"]["roles"]

        elif(etc == "message"):
            # index.tools.db.ctx(f"{ctx.guild.id}").delete("bienvenidas", "channel")
            # index.tools.db.ctx(f"{ctx.guild.id}").delete("bienvenidas", "message")
            document.delete("channel")
            document.delete("message")
            message = translations["deactivate"]["message"]

        else: 
            # index.tools.db.ctx(f"{ctx.guild.id}").delete("bienvenidas")
            document.delete()

    await ctx.send(message)