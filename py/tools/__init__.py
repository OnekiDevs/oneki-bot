#Libreria discord.py
import discord
from discord.ext import commands

#Otras librerias relevantes
from PIL import Image, ImageDraw, ImageFont, ImageOps
from io import BytesIO
from os import getenv, remove
import json

#Modulos del proyecto
from tools import db

bot = commands.Bot(command_prefix = "r!", description = "Bot oficial de La Resistencia", intents = discord.Intents.all())