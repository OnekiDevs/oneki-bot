from dotenv import load_dotenv
import tools

load_dotenv()

tools.bot.remove_command('help')

from commands import moderation, avatar
from events import join, messages, ready

tools.bot.run(tools.getenv("TOKEN_DISCORD"))