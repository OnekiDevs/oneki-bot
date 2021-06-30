import tools

idioms = ["en", "es", "fr", "zh"]

@tools.commands.has_permissions(administrator = True)
@tools.bot.command(name = "lang", aliases = ["language"])
async def lang(ctx, language):
    translations = tools.translations(tools.get_config(ctx), "commands/config/lang")
    try: 
        idioms.index(language)
        collection = tools.db.ctx("config")
        server = collection.get(f"{ctx.guild.id}")
        if(server == None): collection.set(f"{ctx.guild.id}", {"lang" : language})
        else: 
            try: tools.serv[f"{ctx.guild.id}"]["prefix"] = server["prefix"]
            except(KeyError): tools.serv[f"{ctx.guild.id}"]["prefix"] = ">"
            collection.update(f"{ctx.guild.id}", "lang", language)
        tools.serv[f"{ctx.guild.id}"]["lang"] = language
        await ctx.send(translations["msg"])
    except(ValueError): await ctx.send(translations["msg_error"])