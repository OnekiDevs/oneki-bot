import tools 

@tools.bot.event
async def on_command_error(ctx, error):
    if(type(error) == tools.commands.errors.MissingPermissions):
        msg = "No tienes los suficientes permisos para usar este comando\n**Permisos faltantes:**\n"
        for i in error.missing_perms:
            msg = msg + f"{i}\n"
        await ctx.send(msg)
    elif(type(error) == tools.commands.errors.BotMissingPermissions):
        msg = "No tengo los suficientes permisos para este comando\n**Permisos faltantes:**\n"
        for i in error.missing_perms:
            msg = msg + f"{i}\n"
        await ctx.send(msg)
    else: 
        channel = tools.bot.get_channel(833780614712131616)
        await channel.send(f"<@&832657807810625577>\n{error}")