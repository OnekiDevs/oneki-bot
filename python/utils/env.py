from dotenv import load_dotenv
from os import getenv

load_dotenv()

TOKEN = getenv("TOKEN_DISCORD")
TOKEN_DEV = getenv("TOKEN_DISCORD_DEV")
TOKEN_FIREBASE = getenv("TOKEN_FIREBASE")
PORT = getenv("PORT")