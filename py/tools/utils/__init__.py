from tools import db
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


def color_hex(hex: str): 
    sixteenIntegerHex = int(hex.replace("#", ""), 16)
    readableHex = int(hex(sixteenIntegerHex), 0)

    return readableHex