import tools
from tools.utils import commands
from commands.moderation.history import index_subcommand as index


def sanctions(document: tools.db.Document, translations):
    _sanctions = ""

    if document.exists and document.content:
        for type, sanctions in document.content.items():
            if sanctions:
                num = 0
                for sanction in sanctions:
                    _sanctions += f"{type} {num}:\n```{sanction['razon']}```\n"
                    num += 1

            else: _sanctions = translations['no_infractions']

    else: _sanctions = translations['no_infractions']

    return _sanctions


def reports(document: tools.db.Document, translations):
    reports = ""

    if document.exists and document.content:
        for key, value in document.content.items():
            if key == "report_id": continue

            else: 
                _id = str(value['id'])
                _author = str(value['author'])
                _report = value['report']

                reports += translations['report_content'].format(key, _id, _author, _report)

    else: reports = translations['no_reports']

    return reports


@tools.bot.group()
@tools.commands.has_permissions(view_audit_log = True)
async def history(ctx: tools.commands.Context):
    translations = commands.get_config(ctx, "moderation/history")
    if ctx.invoked_subcommand is None:
        async with ctx.typing():
            document = tools.db.Document(collection = f"{ctx.guild.id}", document = "users")
            
            embed = tools.discord.Embed(
                description = translations['embed_history']['description'],
                color = tools.discord.Colour.purple(),
                timestamp = tools.datetime.utcnow()
            )
            embed.set_author(name = translations['embed_history']['author'])
            
            for subcollection in document.subcollections(limit = 3):
                user = tools.bot.get_user(int(subcollection.id)) 

                embed.add_field(name = f"{user.name}", value = sanctions(subcollection.document("sanctions"), translations)) #:nais:

            await ctx.send(embed = embed)