from tools import servers, exceptions

def get_config(ctx):
    server = servers.get(f"{ctx.guild.id}")
    if server is not None:
        prefix = server["prefix"]
        lang = server["lang"]
    else: 
        prefix = ">"
        lang = "en"

    if(ctx.prefix == prefix):
        return lang
    else: raise exceptions.WrongPrefix("Prefijo equivocado")