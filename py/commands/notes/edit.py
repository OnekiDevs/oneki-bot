import tools
from commands.notes import index_subcommand as index

@index.notes.command()
async def edit(ctx, notebook, page, *, content):
    async with ctx.typing():
        document = tools.db.Document(collection = "users", document = f"{ctx.author.id}", subcollection = "notes", subdocument = notebook)
        if document.exists:
            embed = tools.discord.Embed(
                description = f"Edición del cuaderno **{notebook}**",
                colour = tools.utils.color_hex("#4260b6") 
            )
            embed.set_author(name = notebook.capitalize(), icon_url = ctx.author.avatar_url)
            embed.set_thumbnail(url = index.img)

            if page == "description": 
                embed.add_field(name = "Descripción antigua:", value = f'```{document.content["config"]["description"]}```')
                document.update("config.description", content)
                embed.add_field(name = "Descripción nueva:", value = f'```{content}```')

            elif page == "color": 
                embed.add_field(name = "Color antiguo:", value = f'```{document.content["config"]["color"]}```')
                document.update("config.color", content)
                embed.add_field(name = "Color nuevo:", value = f'```{content}```')

            else:
                if tools.utils.check_links(content):
                    document.update(page, content)
                    embed.add_field(name = "Contenido nuevo:", value = f"```{content}```")

                else:
                    await ctx.send("Por motivos de moderación no esta permitido poner links dentro de las notas...")
                    return

        else:
            embed = index.not_found(ctx, notebook)

    await ctx.send(embed = embed)