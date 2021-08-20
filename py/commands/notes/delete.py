import tools
from commands.notes import index_subcommand as index

@index.notes.command()
async def delete(ctx, notebook, page = None):
    #translations = tools.utils.translations(tools.get_config(ctx), "commands/notes")
    async with ctx.typing():
        collection = index.tools.db.ctx("notes")
        document = tools.db.Document(collection = "users", document = f"{ctx.author.id}", subcollection = "notes", subdocument = notebook)
        if document.exists:
            color = document.content["config"]["color"]
            if page is not None:
                document.delete(page)

                embed = tools.discord.Embed(
                    description = f"La página **{page}** del cuaderno **{notebook}** fue eliminada",
                    colour = tools.utils.color_hex(color) 
                )
                embed.set_author(name = "Página eliminada", icon_url = ctx.author.avatar_url)

            else:
                document.delete()
                
                embed = tools.discord.Embed(
                    description = f"El cuaderno **{notebook}** fue eliminado",
                    colour = tools.utils.color_hex(color) 
                )
                embed.set_author(name = "Cuaderno eliminado", icon_url = ctx.author.avatar_url)

            embed.set_thumbnail(url = index.img)

        else:
            embed = index.not_found(ctx, notebook)

    await ctx.send(embed = embed)