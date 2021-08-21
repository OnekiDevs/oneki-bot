import tools
from commands.notes import index_subcommand as index

@index.notes.command()
async def view(ctx, notebook: str, page = None):
    translations = index.commands.get_config(ctx, "notes")
    async with ctx.typing():
        document = tools.db.Document(collection = "users", document = f"{ctx.author.id}", subcollection = "notes", subdocument = notebook)
        if document.exists:  
            content = document.content
            embed = tools.discord.Embed(
                description = content["config"]["description"], 
                colour = tools.utils.color_hex(content["config"]["color"])
            )

            if page is not None:
                embed.set_author(name = translations["embed_view"]["author"].format(notebook.capitalize(), page), icon_url = ctx.author.avatar_url)
                content_page = content.get(page)
                if content_page is not None:
                    embed.add_field(name = translations["embed_view"]["field"], value = f"```{content_page}```")

                else: 
                    embed.description = translations["embed_view"]["description"]

            else: 
                embed.set_author(name = f"{notebook.capitalize()}", icon_url = ctx.author.avatar_url)
                for _page, _content in content.items():
                    if _page == "config": continue
                    else:
                        embed.add_field(name = f"{_page}", value = f"```{_content}```", inline = False)
                
            embed.set_thumbnail(url = index.img)

        else: 
            embed = index.not_found(ctx, notebook, translations["not_found"])

    await ctx.send(embed = embed)