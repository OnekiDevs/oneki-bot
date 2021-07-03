from commands.config.join import index_subcommand as index

@index.join.command()
@index.tools.commands.has_permissions(administrator = True)
async def message(ctx, channel : index.tools.discord.TextChannel, *, message):
    translations = index.tools.translations(index.tools.get_config(ctx), "commands/config/join")
    async with ctx.typing():
        collection = index.tools.db.ctx(f"{ctx.guild.id}")
        if(collection.get("bienvenidas") == None):
            collection.set("bienvenidas", {
                "channel" : f"{channel.id}", 
                "message" : message
            })
        else: 
            collection.update("bienvenidas", "channel", f"{channel.id}")
            collection.update("bienvenidas", "message", message)
    await ctx.send(translations["message"])