import tools

img = "https://media.discordapp.net/attachments/725140299873124372/863238505109913630/depositphotos_325926388-stock-illustration-blue-notebook-with-spiral-vector.png"

def not_found(ctx, notebook):
    embed = tools.discord.Embed(
        description = f"No se encontro ningun cuaderno con el nombre **{notebook}**",
        colour = tools.utils.color_hex("#4260b6")
    )
    embed.set_author(name = "Cuaderno inexistente", icon_url = ctx.author.avatar_url)

    return embed

@tools.bot.group()
async def notes(ctx):
    #translations = tools.utils.translations(tools.get_config(ctx), "commands/notes")
    if ctx.invoked_subcommand is None:
        async with ctx.typing():
            collection = tools.db.Collection(collection = "users", document = f"{ctx.author.id}", subcollection = "notes")
            
            embed = tools.discord.Embed(
                description = "Aqui un listado de tus cuadernos", 
                colour = tools.utils.color_hex("#4260b6")
            )
            embed.set_author(name = f"Notebooks", icon_url = ctx.author.avatar_url)
            embed.set_thumbnail(url = img)

            for document in collection.documents(5):
                value = ""
                for page, content in document.content.items():
                    if page == "config": continue
                    else: 
                        value += f"{page}:\n```{content}```\n"

                embed.add_field(name = document, value = value, inline = False)

        await ctx.send(embed = embed)