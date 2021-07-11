from commands.notes import index_subcommand as index

@index.notes.command()
async def view(ctx, notebook, page):
    async with ctx.typing():
        collection = index.tools.db.ctx("notes")
        document = collection.get(f"{ctx.author.id}", subcollection = notebook, subdocumnt = page)
        config = collection.get(f"{ctx.author.id}", notebook)
        sixteenIntegerHex = int(config["color"].replace("#", ""), 16)
        readableHex = int(hex(sixteenIntegerHex), 0)
        embed = index.tools.discord.Embed(
            description = config["description"], 
            colour = readableHex
        )
        embed.set_author(name = f"Contenido de {page}", icon_url = ctx.author.avatar_url)
        embed.set_thumbnail(url = "https://media.discordapp.net/attachments/725140299873124372/863238505109913630/depositphotos_325926388-stock-illustration-blue-notebook-with-spiral-vector.png")
        for part in document:
            embed.add_field(name = f"{part}", value = f"```{document[part]}```", inline = False)
    await ctx.send(embed = embed)