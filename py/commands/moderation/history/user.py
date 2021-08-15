import tools
from commands.moderation.history import index_subcommand as index

@index.history.command()
@tools.commands.has_permissions(manage_messages = True)
async def user(ctx, user: tools.discord.User):
    # translations = tools.utils.translations(index.commands.get_config(ctx), "commands/history")
    subcollection = tools.db.Collection(collection = f"{ctx.guild.id}", document = "users", subcollection = f"{user.id}")
        
    embed = tools.discord.Embed(
        description = "Si quieres hacer un filtro considera usar `history filter @user [filtro]`",
        color = tools.discord.Colour.purple(),
        timestamp = tools.datetime.utcnow()
    )
    embed.set_author(name = f"Historial de {user.name}")

    embed.add_field(name = f"Reportes:", value = index.reports(subcollection))
    embed.add_field(name = f"Sanciones:", value = index.sanctions(subcollection))

    await ctx.send(embed = embed)