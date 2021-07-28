import tools

idioms = ["en", "es", "fr", "zh", "ko", "ru"]

@tools.commands.has_permissions(administrator = True)
@tools.bot.command(name = "lang", aliases = ["language"])
async def lang(ctx, language):
    translations = tools.utils.translations(tools.get_config(ctx), "commands/config/lang")
    try: 
        idioms.index(language)
        async with ctx.typing():
            document = tools.db.Document(collection = "config", document = f"{ctx.guild.id}")

            if document.exists:
                tools.servers[f"{ctx.guild.id}"]["lang"] = language
                document.update("lang", language)
            else: 
                tools.servers[f"{ctx.guild.id}"] = {"prefix": ">", "lang": language}
                document.set(lang = language, prefix = ">")

            # if(server == None): collection.set(f"{ctx.guild.id}", {"lang" : language})
            # else: 
            #     try: 
            #         tools.servers[f"{ctx.guild.id}"]["prefix"] = server["prefix"]
            #     except(KeyError): 
            #         tools.servers[f"{ctx.guild.id}"]["prefix"] = ">"
            #     collection.update(f"{ctx.guild.id}", "lang", language)
            # tools.servers[f"{ctx.guild.id}"]["lang"] = language

        await ctx.send(translations["msg"])

    except(ValueError): 
        await ctx.send(translations["msg_error"])