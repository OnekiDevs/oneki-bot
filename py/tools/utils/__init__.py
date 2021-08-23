from tools import db, re
import discord
import json


def translations(language, path) -> dict:
    try:
        with open(f"src/lang/{language}/{path}.json", "r") as f:
            return json.loads(f.read())
    except(FileNotFoundError): 
        with open(f"src/lang/en/{path}.json", "r") as f:
            return json.loads(f.read()) 


def get_user(user: discord.User) -> discord.User: 
    return user


def dict_servers() -> dict:
    servers = {}

    collection = db.Collection(collection = "config")
    for document in collection.documents():
        content: dict = document.content

        if is_empty(content): continue # documento vacio
        elif document.id == "bot": continue # ignorando el documento bot
        else: # documento del servidor con datos
            if(content.get("lang") == None): 
                content["lang"] = "en"
            elif(content.get("prefix") == None): 
                content["prefix"] = ">"
            servers[f"{document.id}"] = content

    return servers


def is_empty(data_structure) -> True | False: 
    if data_structure: 
        return False
    else: return True


def check_links(string):
    regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
    return re.findall(regex, string)


def color_hex(_hex: str): 
    sixteenIntegerHex = int(_hex.replace("#", ""), 16)
    readableHex = int(hex(sixteenIntegerHex), 0)

    return readableHex