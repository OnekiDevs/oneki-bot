import tools

@tools.bot.event
async def on_message(message):
    await tools.bot.process_commands(message)
    if(message.author.bot): return

    if(message.content.split(' ')[0] == "<@!832137212266283049>"):
        prefix = tools.serv[f"{message.guild.id}"]
        if(prefix == False): prefix = ">"
        await message.channel.send(f"Hola!, si necesitas ayuda puedes usar **{prefix}help**")