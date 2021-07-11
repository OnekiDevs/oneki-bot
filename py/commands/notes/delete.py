from commands.notes import index_subcommand as index

@index.notes.command()
async def delete(ctx, notebook, page = None, part = None):
    #translations = tools.utils.translations(tools.get_config(ctx), "commands/notes")
    msg = "Se elimino el cuaderno **{}**".format(notebook)
    async with ctx.typing():
        collection = index.tools.db.ctx("notes")
        if page is not None:
            msg = "Se elimino la pagina **{}** del cuaderno **{}**".format(page, notebook)
            if part is not None:
                collection.delete(f"{ctx.author.id}", part, subcollection = notebook, subdocumnt = page)
                msg = "Se elimino una parte de la pagina **{}** del cuaderno **{}**".format(page, notebook)
            else: collection.delete(f"{ctx.author.id}", subcollection = notebook, subdocumnt = page)
        else: 
            collection.delete_subcollection(f"{ctx.author.id}", notebook, 5)
            collection.delete(f"{ctx.author.id}", notebook)
    await ctx.send(msg)