from tools import servers, exceptions
from tools.utils import translations

def get_config(ctx, path):
    server = servers.get(f"{ctx.guild.id}")
    if server is not None:
        prefix = server["prefix"]
        lang = server["lang"]

    else: 
        prefix = ">"
        lang = "en"

    if ctx.prefix == prefix:
        return translations(lang, f"commands/{path}")

    else: 
        raise exceptions.WrongPrefix("Prefijo equivocado")