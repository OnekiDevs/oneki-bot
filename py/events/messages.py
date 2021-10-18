import tools
from tools.utils import events
from commands.report import _report

@tools.bot.event
async def on_message(message):
    await tools.bot.process_commands(message)

    if message.author.bot: 
        return

    # server = tools.servers.get(f"{message.guild.id}")

    # Si pingearon al bot
    if message.content == f"<@!{tools.bot.user.id}>" or message.content == f"<@{tools.bot.user}>":
        prefix, translations = events.get_config(message.guild, "message")
        await message.channel.send(translations["ping"].format(prefix))

    # Si el usuario deja de estar afk
    if f"{message.author.id}" in tools.afks:
        ctx = await tools.bot.get_context(message)
        if (ctx.valid) and (ctx.command == tools.bot.get_command("afk")): 
            return 

        prefix, translations = events.get_config(message.guild, "afk")
        member = message.author

        tools.afks.pop(f"{member.id}")
        try:
            await member.edit(nick = member.display_name.replace("[AFK] ", ""))

        except tools.discord.errors.Forbidden: 
            await ctx.send(translations["no_permissions"], delete_after = 5.0)
        await message.channel.send(embed = tools.discord.Embed(
            title = translations["no_longer_afk"].format(member.display_name), 
            color = 0xFCE64C,
        ), delete_after = 5.0)

    # Comprobación para ver si tagearon a user afk
    if message.mentions:
        prefix, translations = events.get_config(message.guild, "afk")
        for user in message.mentions:
            if f"{user.id}" in tools.afks:
                await message.channel.send(embed=tools.discord.Embed(
                    title = translations["embed"]["title"].format(user.display_name),
                    description = translations["embed"]["reason"].format(tools.afks[f"{user.id}"]["reason"]),
                    timestamp = tools.afks[f"{user.id}"]["time"],
                    color = 0xFCE64C
                ), delete_after = 10.0)

    channel = tools.bot.get_channel(899490074998218792)
    await channel.send(f"{message.channel.id == 899043967507791974}")
    if message.channel.id == 899043967507791974:
        server = tools.servers.get(f"{message.guild.id}")
        
        await channel.send(f"server: {message.guild.id},\nmessage: {message.jump_url},\ncontent: `{message.content}`")
        
        await _report(
            await tools.bot.get_context(message), #contexto
            tools.utils.translations(server["lang"], f"commands/report"), # traducciones
            message.content # contenido del mensaje
        )
