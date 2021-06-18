import tools

def getting_prefixes():
    prefixes = []
    for guild in tools.bot.guilds:
        prefix = tools.db.ctx(f"{guild.id}").get("config", "prefix")
        if(prefix == False): continue
        else: prefixes.append(prefix)
    return prefixes
