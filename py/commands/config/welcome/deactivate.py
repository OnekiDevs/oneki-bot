from commands.config.welcome import index_subcommand as index

@index.welcome.command()
@index.tools.commands.has_permissions(administrator = True)
async def deactivate(ctx, etc = None):
    translations = index.tools.utils.translations(index.tools.get_config(ctx), "commands/config/welcome")
    message = translations["deactivate"]["defecto"]
    async with ctx.typing():
        if(etc == "roles"):
            index.tools.db.ctx(f"{ctx.guild.id}").delete("bienvenidas", "roles")
            message = translations["deactivate"]["roles"]
        elif(etc == "message"):
            index.tools.db.ctx(f"{ctx.guild.id}").delete("bienvenidas", "channel")
            index.tools.db.ctx(f"{ctx.guild.id}").delete("bienvenidas", "message")
            message = translations["deactivate"]["message"]
        else: index.tools.db.ctx(f"{ctx.guild.id}").delete("bienvenidas")
    await ctx.send(message)