from tools import bot, db

def getting_prefixes():
    prefixes = []
    for guild in bot.guilds:
        prefix = db.ctx(f"{guild.id}").get("config", "prefix")
        if(prefix == False): continue
        else: prefixes.append(prefix)
    return prefixes