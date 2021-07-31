from tools import servers, utils

def get_config(guild, event_name):
    server = servers.get(f"{guild.id}")

    if server is not None:
        prefix = server["prefix"]
        translations = utils.translations(server["lang"], f"events/{event_name}")
    else:
        prefix = ">"
        translations = utils.translations("en", f"events/{event_name}")

    return prefix, translations