from commands.config.welcome import index_subcommand as index

@index.welcome.command()
@index.tools.commands.has_permissions(administrator = True)
async def message(ctx, channel : index.tools.discord.TextChannel, *, message):
    translations = index.tools.utils.translations(index.tools.get_config(ctx), "commands/config/welcome")

    async with ctx.typing():
        document = index.tools.db.Document(collection = f"{ctx.guild.id}", document = "bienvenidas")

        if document.exists:
            document.update("channel", f"{channel.id}")
            document.update("message", message)

        else: 
            document.set(channel = f"{channel.id}", message = message)

        # if(collection.get("bienvenidas") == None):
        #     collection.set("bienvenidas", {
        #         "channel" : f"{channel.id}", 
        #         "message" : message
        #     })
        # else: 
        #     collection.update("bienvenidas", "channel", f"{channel.id}")
        #     collection.update("bienvenidas", "message", message)

    await ctx.send(translations["message"])