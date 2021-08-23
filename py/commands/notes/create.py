import tools
from commands.notes import index_subcommand as index

@index.notes.command()
async def create(ctx, notebook, *, description, color = "#4260b6"):
    translations = index.commands.get_config(ctx, "notes")
    async with ctx.typing():
        collection = tools.db.Collection(collection = "users", document = f"{ctx.author.id}", subcollection = "notes")

        collection.set(notebook, config = {"description": description, "color": color})

    await ctx.send(translations["create"].format(notebook))