import tools
from tools.utils import commands

img = "https://media.discordapp.net/attachments/725140299873124372/863238505109913630/depositphotos_325926388-stock-illustration-blue-notebook-with-spiral-vector.png"
color = "#4260b6"

def not_found(ctx, notebook, translations):
    embed = tools.discord.Embed(
        description = translations["description"].format(notebook),
        colour = tools.utils.color_hex(color)
    )
    embed.set_author(name = translations["author"], icon_url = ctx.author.avatar_url)

    return embed

@tools.bot.group()
async def notes(ctx):
    translations = commands.get_config(ctx, "notes")
    if ctx.invoked_subcommand is None:
        async with ctx.typing():
            collection = tools.db.Collection(collection = "users", document = f"{ctx.author.id}", subcollection = "notes")
            
            embed = tools.discord.Embed(
                description = translations["embed_index"]["description"], 
                colour = tools.utils.color_hex(color)
            )
            embed.set_author(name = translations["embed_index"]["author"], icon_url = ctx.author.avatar_url)
            embed.set_thumbnail(url = img)

            for document in collection.documents(5):
                value = ""
                for page, content in document.content.items():
                    if page == "config": continue
                    else: 
                        value += f"{page}:\n```{content}```\n"

                embed.add_field(name = document, value = value, inline = False)

        await ctx.send(embed = embed)