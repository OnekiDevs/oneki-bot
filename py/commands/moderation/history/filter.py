import tools
from commands.moderation.history import index_subcommand as index

def sanctions(document, filter):
    if document.exists:
        for type, sanctions in document.content.items():
            for sanction in sanctions:
                if tools.re.search(str(filter), sanction['razon']) is not None:
                    yield f"{type}", f"```{sanction['razon']}```"
                else: yield None

def reports(document, filter):
    if document.exists:
        for key, report in document.content.items():
            if key == "report_id": continue

            else: 
                _id = str(report['id'])
                _author = str(report['author'])
                _report = report['report']

                if tools.re.search(str(filter), _report) is not None:
                    yield _id, _author, f"```{_report}```"
                else: yield None

@index.history.command()
@tools.commands.has_permissions(view_audit_log = True)
async def filter(ctx, user: tools.discord.User, filter):
    translations = tools.utils.translations(index.commands.get_config(ctx), "commands/moderation/history")
    async with ctx.typing():
        collection = tools.db.Collection(collection = f"{ctx.guild.id}", document = "users", subcollection = f"{user.id}")

        embed = tools.discord.Embed(
            description = translations['embed_filter_no_coicidences'].format(filter),
            color = tools.discord.Colour.purple(),
            timestamp = tools.datetime.utcnow()
        )
        embed.set_author(name = translations['embed_filter']['author'])
        description = translations['embed_filter']['description']

        for sanction in sanctions(collection.document("sanctions"), filter):
            if sanction is not None:
                embed.add_field(name = sanction[0], value = sanction[1])
                embed.description = description

        for report in reports(collection.document("reports"), filter):
            if report is not None:
                embed.add_field(name = translations['embed_filter']['field']['name'].format(report[0]), value = translations['embed_filter']['field']['value'].format(report[1], report[2]))
                embed.description = description

    await ctx.send(embed = embed)