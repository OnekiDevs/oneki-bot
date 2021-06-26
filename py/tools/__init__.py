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
import json
import re

#Modulos del proyecto
from tools import db
from tools.defs import get_user, give_role, remove_role, give_list_roles
from tools import exceptions

#Funciones y variables
serv = {}
mutes = {}
bot = commands.Bot(command_prefix = ["!", ">"], description = "Bot oficial de La Resistencia", intents = discord.Intents.all())

def get_prefix(ctx):
    if(ctx.prefix == serv[f"{ctx.guild.id}"]): pass
    else:
        raise exceptions.WrongPrefix("Prefijo equivocado")

def dic_prefixes():
    collection = db.ctx("config")
    for guild in bot.guilds:
        prefix = collection.get(f"{guild.id}", "prefix")
        if(prefix == False): continue
        else: 
            serv[f"{guild.id}"] = prefix
    return serv
