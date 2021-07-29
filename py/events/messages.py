import tools

@tools.bot.event
async def on_message(message):
    await tools.bot.process_commands(message)

    if message.author.bot: 
        return

    # si pingearon al bot
    if tools.bot.user.mentioned_in(message):
        server = tools.servers.get(f"{message.guild.id}")
        if server is not None:
            prefix = server["prefix"]
            translations = tools.utils.translations(server["lang"], "events/message")
        else:
            prefix = ">"
            translations = tools.utils.translations("en", "events/message")
        await message.channel.send(translations["ping"].format(prefix))