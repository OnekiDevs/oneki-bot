import tools

@tools.bot.group()
async def notes(ctx):
    #translations = tools.utils.translations(tools.get_config(ctx), "commands/notes")
    if ctx.invoked_subcommand is None:
        async with ctx.typing():
            collection = tools.db.Collection(collection = "users", document = f"{ctx.author.id}", subcollection = "notes")
            
            embed = tools.discord.Embed(
                description = "Aqui un listado de tus cuadernos", 
                colour = ctx.author.color
            )
            embed.set_author(name = f"Notebooks", icon_url = ctx.author.avatar_url)
            embed.set_thumbnail(url = "https://media.discordapp.net/attachments/725140299873124372/863238505109913630/depositphotos_325926388-stock-illustration-blue-notebook-with-spiral-vector.png")

            for document in collection.documents(5):
                value = ""
                for page, content in document.content.items():
                    if page == "config": continue
                    else: 
                        value += f"{page}:\n```{content}```\n"

                embed.add_field(name = document, value = value, inline = False)

        await ctx.send(embed = embed)