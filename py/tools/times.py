import tools 

def dic_mutes():
    mutes = {}
    for guild in tools.bot.guilds:
        dic = tools.db.ctx("times").get(f"{guild.id}", "mute")
        if(dic == False): continue
        else: 
            mutes[f"{guild.id}"] = dic
    return mutes

def dic_bans():
    bans = {}
    for guild in tools.bot.guilds:
        dic = tools.db.ctx("times").get(f"{guild.id}", "ban")
        if(dic == False): continue
        else: 
            bans[f"{guild.id}"] = dic
    return bans

def mutetime(dic_mutes):
    for i in dic_mutes:
        for j in dic_mutes[i]:
            if(dic_mutes[i][j]["time"] > tools.datetime.utcnow()):
                tools.give_list_roles(
                    tools.bot.get_guild(int(i)), 
                    int(j),
                    dic_mutes[i][j]["roles"]
                )
                tools.db.ctx("times").delete(i, camp = f"mute.{j}")