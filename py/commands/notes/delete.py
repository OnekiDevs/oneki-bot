import tools
from commands.notes import index_subcommand as index

@index.notes.command()
async def delete(ctx, notebook, page = None):
    translations = index.commands.get_config(ctx, "notes")
    async with ctx.typing():
        document = tools.db.Document(collection = "users", document = f"{ctx.author.id}", subcollection = "notes", subdocument = notebook)
        if document.exists:
            color = document.content["config"]["color"]
            if page is not None:
                document.delete(page)

                embed = tools.discord.Embed(
                    description = translations["embed_del_page"]["description"].format(page, notebook),
                    colour = tools.utils.color_hex(color) 
                )
                embed.set_author(name = translations["embed_del_page"]["author"], icon_url = ctx.author.avatar_url)

            else:
                document.delete()
                
                embed = tools.discord.Embed(
                    description = translations["embed_del_note"]["description"].format(notebook),
                    colour = tools.utils.color_hex(color) 
                )
                embed.set_author(name = translations["embed_del_note"]["author"], icon_url = ctx.author.avatar_url)

            embed.set_thumbnail(url = index.img)

        else:
            embed = index.not_found(ctx, notebook, translations["not_found"])

    await ctx.send(embed = embed)