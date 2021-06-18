import tools

@tools.bot.event
async def on_message(message):
    await tools.bot.process_commands(message)
    if(message.author.bot): return

    ctx = tools.db.ctx(f"{message.guild.id}")
    if(message.content.split(' ')[0] == "<@!832137212266283049>"):
        await message.channel.send(f"Hola!, si necesitas ayuda puedes usar {tools.bot.command_prefix}help")