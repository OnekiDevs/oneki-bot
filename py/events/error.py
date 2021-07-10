import tools 

@tools.bot.event
async def on_command_error(ctx, error):
    try: 
        translations = tools.utils.translations(tools.get_config(ctx), "events/error")
    except(tools.exceptions.WrongPrefix): return
    if(type(error) == tools.commands.errors.MissingPermissions):
        msg = translations["MissingPermissions"]
        for i in error.missing_perms:
            msg = msg + f"`{i}`\n"
        await ctx.send(msg)
    elif(type(error) == tools.commands.errors.BotMissingPermissions):
        msg = translations["BotMissingPermissions"]
        for i in error.missing_perms:
            msg = msg + f"`{i}`\n"
        await ctx.send(msg)
    elif(type(error) == tools.commands.errors.MissingRequiredArgument): 
        await ctx.send(translations["MissingRequiredArgument"].format(error.param.name))
    elif(type(error) == tools.commands.errors.CommandNotFound): pass
    elif(type(error) == tools.exceptions.WrongPrefix): pass
    else: 
        channel = tools.bot.get_channel(833780614712131616)
        embed = tools.discord.Embed(description = "Se a producido un error D:", color = tools.discord.Colour.blue())
        embed.set_author(name = "Link Error", url = f"{ctx.message.jump_url}")
        embed.add_field(name = "Tipo:", value = f"{type(error)}")
        embed.add_field(name = "Detalle:", value = f"{error}", inline = False)
        embed.set_image(url = "https://cdn.discordapp.com/attachments/725140299873124372/855196781632290846/error.gif")
        await channel.send(embed = embed)