import tools
from commands.notes import index_subcommand as index

@index.notes.command()
async def view(ctx, notebook: str, page = None):
    async with ctx.typing():
        document = tools.db.Document(collection = "users", document = f"{ctx.author.id}", subcollection = "notes", subdocument = notebook)
        if document.exists:  
            content = document.content
            embed = tools.discord.Embed(
                description = content["config"]["description"], 
                colour = tools.utils.color_hex(content["config"]["color"])
            )

            if page is not None:
                embed.set_author(name = f"{notebook.capitalize()} en {page}", icon_url = ctx.author.avatar_url)
                content_page = content.get(page)
                if content_page is not None:
                    embed.add_field(name = "Contenido:", value = f"```{content_page}```")

                else: 
                    embed.description = "pagina inexistente"

            else: 
                embed.set_author(name = f"{notebook.capitalize()}", icon_url = ctx.author.avatar_url)
                for _page, _content in content.items():
                    if _page == "config": continue
                    else:
                        embed.add_field(name = f"{_page}", value = f"```{_content}```", inline = False)
                
            embed.set_thumbnail(url = "https://media.discordapp.net/attachments/725140299873124372/863238505109913630/depositphotos_325926388-stock-illustration-blue-notebook-with-spiral-vector.png")

        else: 
            embed = tools.discord.Embed(
                description = f"No se encontro ningun cuaderno con el nombre \"{notebook}\"",
                colour = tools.discord.Colour.greyple()
            )
            embed.set_author(name = "Cuaderno inexistente", icon_url = ctx.author.avatar_url)

    await ctx.send(embed = embed)