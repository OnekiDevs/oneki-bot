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
from tools.roles import give_role, remove_role, give_list_roles

bot = commands.Bot(command_prefix = "", description = "Bot oficial de La Resistencia", intents = discord.Intents.all())
