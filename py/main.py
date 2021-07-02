from dotenv import load_dotenv
import tools

load_dotenv()

tools.bot.remove_command('help')

#Comandos del bot
from commands import avatar, info
from commands.config import lang, join
from commands.moderation import mute, unmute
#Eventos
from events import error, join, messages, ready

tools.bot.run(tools.getenv("TOKEN_DISCORD"))