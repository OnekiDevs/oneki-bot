from dotenv import load_dotenv
import tools

load_dotenv()

from commands import avatar
from events import join, messages, ready

tools.bot.run(tools.getenv("TOKEN_DISCORD"))