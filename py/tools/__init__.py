#Libreria discord.py
import discord
from discord.ext import commands

#Otras librerias relevantes
from PIL import Image, ImageDraw, ImageFont, ImageOps
from io import BytesIO
from os import remove
import json

bot = commands.Bot(command_prefix = "n!", description = "Bot aun NO oficial de la neo army", intents = discord.Intents.all())