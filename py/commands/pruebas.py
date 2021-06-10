import tools

@tools.bot.command()
async def pruebas (ctx, *, report = None):
    return
    ctx.message.delete()
    if(report == None): ctx.send(content = "Porfavor pon tu reporte como parametro del comando", delete_after = 1.5)
    else: 
        collection = tools.db.ctx(f"{ctx.guild.id}")
        collection.get("report")
