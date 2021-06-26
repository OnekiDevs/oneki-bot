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
    try:
        if(ctx.prefix == serv[f"{ctx.guild.id}"]["prefix"]): return ">"
        else:
            raise exceptions.WrongPrefix("Prefijo equivocado")
    except(KeyError): 
        if(ctx.prefix == ">"): return ">"

def get_lang(ctx):
    pass

def dic_servers():
    collection = db.ctx("config")
    for guild in bot.guilds:
        doc = collection.get(f"{guild.id}")
        if(doc == False): continue
        else: 
            serv[f"{guild.id}"] = doc
    return serv

