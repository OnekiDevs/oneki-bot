import tools
from tools.utils import roles


def time(time):
    hoy = tools.datetime.utcnow()
    search = tools.re.search(r"[0-9]+[dhms]", time)
    if(search is not None):
        dia = tools.re.split(r"[0-9]+", time)[1]
        tiempo = int(tools.re.split(r"[dhms]", time)[0])
        if(dia == "d"): 
           return (float(86400 * tiempo), hoy, hoy + tools.timedelta(days = tiempo)) 

        elif(dia == "h"): 
            return (float(3600 * tiempo), hoy, hoy + tools.timedelta(hours = tiempo))

        elif(dia == "m"): 
            return (float(60 * tiempo), hoy, hoy + tools.timedelta(minutes = tiempo))

        elif(dia == "s"): 
            return (float(tiempo), hoy, hoy + tools.timedelta(seconds = tiempo))

    else: return (float(3600 * 5), hoy, hoy + tools.timedelta(minutes = 5))

def embed(guild, author, translations, member: tools.discord.Member, value) -> tools.discord.Embed:
    user = tools.utils.get_user(member)

    embed = tools.discord.Embed(
        description = translations["embed"]["description"].format(guild.name),
        colour = tools.discord.Colour.from_rgb(178, 34, 34),
        timestamp = tools.datetime.utcnow()
    )

    embed.set_author(name = translations["embed"]["author"], icon_url = user.avatar_url)
    if(tools.re.search("-c", value) is not None):
        value = value.split("-c ")[1]
        embed.add_field(name = translations["embed"]["field_2"]["name"], value = f"```\n{author.name}\n```", inline = False)
    embed.add_field(name = translations["embed"]["field_1"]["name"], value = f"```\n{value}\n```")

    return embed