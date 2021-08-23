import tools
from commands.moderation.history import index_subcommand as index

@index.history.command()
@tools.commands.has_permissions(view_audit_log = True)
async def user(ctx, user: tools.discord.User):
    translations = index.commands.get_config(ctx, "moderation/history")
    async with ctx.typing():
        subcollection = tools.db.Collection(collection = f"{ctx.guild.id}", document = "users", subcollection = f"{user.id}")
            
        embed = tools.discord.Embed(
            description = translations['embed_user']['description'],
            color = tools.discord.Colour.purple(),
            timestamp = tools.datetime.utcnow()
        )
        embed.set_author(name = translations['embed_user']['author'].format(user.name))

        embed.add_field(name = translations['embed_user']['report_field_name'], value = index.reports(subcollection.document("reports"), translations))
        embed.add_field(name = translations['embed_user']['sanction_field_name'], value = index.sanctions(subcollection.document("sanctions"), translations))

    await ctx.send(embed = embed)