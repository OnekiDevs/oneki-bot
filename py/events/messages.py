import tools

@tools.bot.event
async def on_message(message):
    await tools.bot.process_commands(message)
    if(message.author.bot): return

    if(message.content.split(' ')[0] == "<@!832137212266283049>"):
        try:
            server = tools.serv[f"{message.guild.id}"]
            prefix = server["prefix"]
            translations = tools.translations(server["lang"], "events/message")
        except(KeyError): 
            prefix = ">"
            translations = tools.translations("en", "events/message")
        await message.channel.send(translations["ping"].format(prefix))