import tools 
import traceback
from tools.utils import events

@tools.bot.event
async def on_command_error(ctx, error):
    prefix, translations = events.get_config(ctx.guild, "error")
    if not (prefix == ctx.prefix):
        return

    if isinstance(error, tools.commands.errors.MissingPermissions):
        msg = translations["MissingPermissions"]
        for i in error.missing_perms:
            msg = msg + f"`{i}`\n"
        await ctx.send(msg)

    elif isinstance(error, tools.commands.errors.BotMissingPermissions):
        msg = translations["BotMissingPermissions"]
        for i in error.missing_perms:
            msg = msg + f"`{i}`\n"
        await ctx.send(msg)

    elif isinstance(error, tools.commands.errors.MissingRequiredArgument): 
        await ctx.send(translations["MissingRequiredArgument"].format(error.param.name))

    elif isinstance(error, tools.commands.errors.CommandNotFound): pass
    elif isinstance(error, tools.exceptions.WrongPrefix): pass

    else: 
        channel = tools.bot.get_channel(885674115615301651)

        msg = "".join(traceback.format_exception(type(error), error, error.__traceback__))

        embed = tools.discord.Embed(description = "Más datos del error", color = tools.discord.Colour.blue())
        embed.set_author(name = "Error", url = f"{ctx.message.jump_url}")
        embed.add_field(name = "Tipo:", value = f"```{type(error)}```", inline = False)
        embed.add_field(name = "Mensaje:", value = f"```{ctx.message.content}```")
        embed.add_field(name = "Detalle:", value = f"```{error}```", inline = False)

        await channel.send(f"**Contexto:**\n```py\n{msg}\n```", embed = embed)
        await ctx.send(error)

        print('Ignoring exception in command {}:'.format(ctx.command))
        traceback.print_exception(type(error), error, error.__traceback__)