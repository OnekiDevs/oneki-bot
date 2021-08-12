# Libreria discord.py
import discord
from discord.ext import commands

# Otras librerias relevantes
from PIL import Image, ImageDraw, ImageFont, ImageOps
from datetime import datetime, timedelta
from asyncio import sleep
from random import choice
from io import BytesIO
from os import remove
import re

# Modulos del proyecto
from tools import db
from tools import env
from tools import utils
from tools import client
from tools import exceptions

# Funciones y variables
servers = {}
mutes = {}
afks = {}
bot = commands.Bot(command_prefix = ["!", ">"], description = "Bot oficial de La Resistencia", intents = discord.Intents.all())

