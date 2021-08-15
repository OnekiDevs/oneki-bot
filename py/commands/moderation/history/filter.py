import tools
from commands.moderation.history import index_subcommand as index

def sanctions(document, filter):
    if document.exists:
        for type, sanctions in document.content.items():
            for sanction in sanctions:
                if tools.re.search(str(filter), sanction['razon']) is not None:
                    yield f"{type}:\n```{sanction['razon']}```"
                else: yield None

@index.history.command()
@tools.commands.has_permissions(manage_messages = True)
async def filter(ctx, user: tools.discord.User, filter):
    # translations = tools.utils.translations(index.commands.get_config(ctx), "commands/history")
    collection = tools.db.Collection(collection = f"{ctx.guild.id}", document = "users", subcollection = f"{user.id}")

    for sanction in sanctions(collection.document("sanctions"), filter):
        if sanction is not None:
            await ctx.send(sanction)