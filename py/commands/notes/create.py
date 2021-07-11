from commands.notes import index_subcommand as index

@index.notes.command()
async def create(ctx, notebook, *, description = "Sin descripción"):
    #translations = tools.utils.translations(tools.get_config(ctx), "commands/notes")
    async with ctx.typing():
        if index.tools.re.search(r"(-colour)$", description) is not None:
            split = index.tools.re.split("-colour", description)
            description = split[0]
            color = split[1]
        else:
            color = "#86e4fc"
        collection = index.tools.db.ctx("notes")
        document = collection.get(f"{ctx.author.id}")
        if document is not None:
            collection.update(f"{ctx.author.id}", notebook, {"description" : description, "color" : color})
        else:
            collection.set(f"{ctx.author.id}", {notebook : {"description" : description, "color" : color}})
    await ctx.send("Se creo el cuaderno **{}** correctamente!".format(notebook))