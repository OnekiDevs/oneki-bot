# Librerias importantes
import discord
from discord.ext import commands
# import discord_slash
# from discord_slash import cog_ext


# Utils imprescindibles
from utils import db


# Etc
import datetime
import asyncio 
import random
import re


# Funciones utiles
def is_empty(data_structure): 
    if data_structure: 
        return False
    else: return True