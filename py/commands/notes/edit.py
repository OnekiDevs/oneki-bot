import tools
from commands.notes import index_subcommand as index

@index.notes.command()
async def edit(ctx, notebook, page, *, content):
    translations = index.commands.get_config(ctx, "notes")
    async with ctx.typing():
        document = tools.db.Document(collection = "users", document = f"{ctx.author.id}", subcollection = "notes", subdocument = notebook)
        if document.exists:
            embed = tools.discord.Embed(
                description = translations["embed_edit"]["description"].format(notebook),
                colour = tools.utils.color_hex(index.color) 
            )
            embed.set_author(name = notebook.capitalize(), icon_url = ctx.author.avatar_url)
            embed.set_thumbnail(url = index.img)

            if page == "description": 
                embed.add_field(name = translations["embed_edit"]["fields_description"]["old"], value = f'```{document.content["config"]["description"]}```')
                document.update("config.description", content)
                embed.add_field(name = translations["embed_edit"]["fields_description"]["new"], value = f'```{content}```')

            elif page == "color": 
                embed.add_field(name = translations["embed_edit"]["fields_color"]["old"], value = f'```{document.content["config"]["color"]}```')
                document.update("config.color", content)
                embed.add_field(name = translations["embed_edit"]["fields_color"]["new"], value = f'```{content}```')

            else:
                if tools.utils.is_empty(tools.utils.check_links(content)) and len(content) < 400:
                    document.update(page, content)
                    embed.add_field(name = translations["embed_edit"]["field_changes"], value = f"```{content}```")

                else:
                    return await ctx.send(translations["error"])

        else:
            embed = index.not_found(ctx, notebook, translations["not_found"])

    await ctx.send(embed = embed)