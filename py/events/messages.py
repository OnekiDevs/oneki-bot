import tools
from tools.utils import events

@tools.bot.event
async def on_message(message):
    await tools.bot.process_commands(message)

    if message.author.bot: 
        return

    server = tools.servers.get(f"{message.guild.id}")

    # Si pingearon al bot
    if message.content == f"<@!{tools.bot.user.id}>" or message.content == f"<@{tools.bot.user}>":
    # if tools.bot.user.mentioned_in(message):
        prefix, translations = events.get_config(message.guild, "message")
        await message.channel.send(translations["ping"].format(prefix))

    # Si el usuario deja de estar afk
    if message.author.id in tools.afks:
        ctx = await tools.bot.get_context(message)
        if (ctx.valid) and (ctx.command == tools.bot.get_command("afk")): 
            return 

        prefix, translations = events.get_config(message.guild, "afk")
        member = message.author

        tools.afks.pop(member.id)
        try:
            await member.edit(nick = member.display_name.replace("[AFK] ", ""))

        except tools.discord.errors.Forbidden or tools.discord.errors.HTTPException:
            if tools.discord.errors.Forbidden: 
                return await ctx.send(translations["no_permissions"])
            return ctx.send(translations["max_name_length"].format(member.mention))

        await message.channel.send(embed = tools.discord.Embed(
            title = translations["no_longer_afk"].format(member.display_name), 
            color = 0xFCE64C,
        ))

    # Comprobación para ver si tagearon a user afk
    if message.mentions:
        prefix, translations = events.get_config(message.guild, "afk")
        for user in message.mentions:
            if user.id in tools.afks:
                await message.channel.send(embed = tools.discord.Embed(
                    title = translations["embed"].format(user.display_name), 
                    description = tools.afks[user.id],
                    color = 0xFCE64C
                ))
