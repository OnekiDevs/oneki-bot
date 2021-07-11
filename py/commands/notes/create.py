from commands.notes import index_subcommand as index

@index.notes.command()
async def create(ctx, notebook, *, description = "Sin descripción"):
    #translations = tools.utils.translations(tools.get_config(ctx), "commands/notes")
    async with ctx.typing():
        collection = index.tools.db.ctx("notes")
        document = collection.get(f"{ctx.author.id}")
        if document is not None:
            collection.update(f"{ctx.author.id}", notebook, description)
        else:
            collection.set(f"{ctx.author.id}", {notebook : description})
    await ctx.send("Se creo el cuaderno **{}** correctamente!".format(notebook))