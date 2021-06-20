from tools import bot, db

def list_prefixes(): 
    prefixes = [">"]
    collection = db.ctx("config")
    for guild in bot.guilds:
        prefix = collection.get(f"{guild.id}", "prefix")
        if(prefix == False): continue
        elif(prefix in prefixes): continue
        else: prefixes.append(prefix)
    return prefixes

def dic_prefixes():
    serv = {}
    collection = db.ctx("config")
    for guild in bot.guilds:
        prefix = collection.get(f"{guild.id}", "prefix")
        if(prefix == False): continue
        else: 
            serv[f"{guild.id}"] = prefix
    return serv