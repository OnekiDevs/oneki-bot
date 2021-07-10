import tools

idioms = ["en", "es", "fr", "zh", "ko", "ru"]

@tools.commands.has_permissions(administrator = True)
@tools.bot.command(name = "lang", aliases = ["language"])
async def lang(ctx, language):
    translations = tools.utils.translations(tools.get_config(ctx), "commands/config/lang")
    try: 
        async with ctx.typing():
            idioms.index(language)
            collection = tools.db.ctx("config")
            server = collection.get(f"{ctx.guild.id}")
            if(server == None): collection.set(f"{ctx.guild.id}", {"lang" : language})
            else: 
                try: 
                    tools.servers[f"{ctx.guild.id}"]["prefix"] = server["prefix"]
                except(KeyError): 
                    tools.servers[f"{ctx.guild.id}"]["prefix"] = ">"
                collection.update(f"{ctx.guild.id}", "lang", language)
            tools.servers[f"{ctx.guild.id}"]["lang"] = language
        await ctx.send(translations["msg"])
    except(ValueError): await ctx.send(translations["msg_error"])