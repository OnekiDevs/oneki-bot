import tools
from commands.notes import index_subcommand as index

@index.notes.command()
async def create(ctx, notebook, *, description, color = "#4260b6"):
    #translations = tools.utils.translations(tools.get_config(ctx), "commands/notes")
    async with ctx.typing():
        collection = tools.db.Collection(collection = "users", document = f"{ctx.author.id}", subcollection = "notes")

        collection.set(notebook, config = {"description": description, "color": color})

    await ctx.send("Se creo el cuaderno **{}** correctamente!".format(notebook))