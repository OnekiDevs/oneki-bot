#Libreria discord.py
import discord
from discord.ext import commands

#Otras librerias relevantes
from PIL import Image, ImageDraw, ImageFont, ImageOps
from datetime import datetime, timedelta
from os import getenv, remove
from asyncio import sleep
from io import BytesIO
from random import choice
import re

#Modulos del proyecto
from tools import db
from tools.defs import translations, get_user, is_empty, give_role, remove_role, give_list_roles
from tools import exceptions

#Funciones y variables
serv = {}
mutes = {}
bot = commands.Bot(command_prefix = ["!", ">"], description = "Bot oficial de La Resistencia", intents = discord.Intents.all())

def get_config(ctx):
    try: 
        server = serv[f"{ctx.guild.id}"]
        prefix = server["prefix"]
        lang = server["lang"]
    except(KeyError):
        prefix = ">"
        lang = "en"
    if(ctx.prefix == prefix): return lang
    else: raise exceptions.WrongPrefix("Prefijo equivocado")

def dic_servers():
    collection = db.ctx("config")
    for guild in bot.guilds:
        doc = collection.get(f"{guild.id}")
        if(doc == None or is_empty(doc) == False): continue
        else: 
            if(doc.get("lang") == None): doc["lang"] = "en"
            elif(doc.get("prefix") == None): doc["prefix"] = ">"
            serv[f"{guild.id}"] = doc
    return serv