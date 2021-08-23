import tools

"""Comandos del bot"""
import commands
import commands.config
import commands.moderation
"""Eventos"""
import events
tools.bot.remove_command("help")
tools.bot.run(tools.env.TOKEN)