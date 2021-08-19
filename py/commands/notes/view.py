import tools
from commands.notes import index_subcommand as index

@index.notes.command()
async def view(ctx, notebook, page = None):
    async with ctx.typing():
        document = tools.db.Document(collection = "users", document = f"{ctx.author.id}", subcollection = "notes", subdocument = str(notebook))
        if document.exists:  
            content = document.content
            config = content["config"]

            embed = tools.discord.Embed(
                description = config["description"], 
                colour = tools.utils.color_hex(config["color"])
            )

            if page is not None:
                embed.set_author(name = f"{page}", icon_url = ctx.author.avatar_url)
                _page = content.get(page)
                if _page is not None:
                    embed.add_field(name = "Contenido:", value = _page)

                else: 
                    embed.description = "pagina inexistente"

            else: 
                for _page, _content in content.items():
                    embed.add_field(name = f"{_page}", value = f"```{_content}```", inline = False)
                
            embed.set_thumbnail(url = "https://media.discordapp.net/attachments/725140299873124372/863238505109913630/depositphotos_325926388-stock-illustration-blue-notebook-with-spiral-vector.png")

        else: 
            await ctx.send(f"No se encontro ningun cuaderno con el nombre \"{notebook}\"")
            return

    await ctx.send(embed = embed)