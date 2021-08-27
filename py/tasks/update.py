import tools
from discord.ext import tasks

def _update():
    document = tools.db.Document(collection = "config", document = "bot")

    document.update("mutes", tools.mutes)
    document.update("afks", tools.afks)

@tasks.loop(minutes = 30)
async def update():
    _update()

    print(f"Datos actualizados en la db: {update.current_loop}")

@update.before_loop
async def before_printer():
    content = tools.db.Document(collection = "config", document = "bot").content
    if (content.get("mutes") is None) or (content.get("afks") is None):
        raise ValueError("mutes/afks tiene el valor de None")

    else: 
        tools.mutes = content.get("mutes")
        tools.afks = content.get("afks")

@update.after_loop
async def after_update():
    _update()

    print('done!')

update.start()