import tools

idioms = ["en", "es"]

@tools.bot.command(name = "lang", aliases = ["language"])
async def lang(ctx, language):
    lang = tools.get_config(ctx)
    try: 
        idioms.index(language)
        collection = tools.db.ctx("config")
        server = collection.get(f"{ctx.guild.id}")
        if(server == None): collection.set(f"{ctx.guild.id}", {"lang" : language})
        else: collection.update(f"{ctx.guild.id}", "lang", language)
        await ctx.send("Se cambio el lenguaje del bot correctamente")
    except(ValueError): await ctx.send("Lamentablemente ese lenguaje aun no esta disponible")