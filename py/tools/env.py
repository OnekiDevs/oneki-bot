from dotenv import load_dotenv
from os import getenv

load_dotenv()

TOKEN = getenv("TOKEN_DISCORD")
TOKEN_DB = getenv("TOKEN_DB")
PORT = getenv("PORT")