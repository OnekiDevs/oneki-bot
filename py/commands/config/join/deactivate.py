from commands.config.join import index_subcommand as index

@index.join.command()
@index.tools.commands.has_permissions(administrator = True)
async def deactivate(ctx, etc = None):
    async with ctx.typing():
        if(etc == "roles"):
            index.tools.db.ctx(f"{ctx.guild.id}").delete("bienvenidas", "roles")
        elif(etc == "message"):
            index.tools.db.ctx(f"{ctx.guild.id}").delete("bienvenidas", "channel")
            index.tools.db.ctx(f"{ctx.guild.id}").delete("bienvenidas", "message")
        else: index.tools.db.ctx(f"{ctx.guild.id}").delete("bienvenidas")
    await ctx.send("Bienvenidas desactivadas")