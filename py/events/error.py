import tools 
import traceback
from tools.utils import commands

@tools.bot.event
async def on_command_error(ctx, error):
    try: 
        translations = tools.utils.translations(commands.get_config(ctx), "events/error")
    except(tools.exceptions.WrongPrefix): return
    if(isinstance(error, tools.commands.errors.MissingPermissions)):
        msg = translations["MissingPermissions"]
        for i in error.missing_perms:
            msg = msg + f"`{i}`\n"
        await ctx.send(msg)
    elif(isinstance(error, tools.commands.errors.BotMissingPermissions)):
        msg = translations["BotMissingPermissions"]
        for i in error.missing_perms:
            msg = msg + f"`{i}`\n"
        await ctx.send(msg)
    elif(isinstance(error, tools.commands.errors.MissingRequiredArgument)): 
        await ctx.send(translations["MissingRequiredArgument"].format(error.param.name))
    elif(isinstance(error, tools.commands.errors.CommandNotFound)): pass
    elif(isinstance(error, tools.exceptions.WrongPrefix)): pass
    else: 
        channel = tools.bot.get_channel(812870134699786270)
        msg = "".join(traceback.format_exception(type(error), error, error.__traceback__))
        embed = tools.discord.Embed(description = "Más datos del error", color = tools.discord.Colour.blue())
        embed.set_author(name = "Error", url = f"{ctx.message.jump_url}")
        embed.add_field(name = "Tipo:", value = f"```{type(error)}```", inline = False)
        embed.add_field(name = "Mensaje:", value = f"```{ctx.message.content}```")
        embed.add_field(name = "Detalle:", value = f"```{error}```", inline = False)
        embed.set_image(url = "https://cdn.discordapp.com/attachments/725140299873124372/855196781632290846/error.gif")
        msg = "".join(traceback.format_exception(type(error), error, error.__traceback__))
        await channel.send("**Contexto:**\n```py\n" + msg + "\n```", embed = embed)
        print('Ignoring exception in command {}:'.format(ctx.command))
        traceback.print_exception(type(error), error, error.__traceback__)