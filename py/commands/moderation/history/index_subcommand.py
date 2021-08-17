import tools
from tools.utils import commands

def sanctions(document: tools.db.Document):
    _sanctions = ""

    if document.exists and document.content:
        for type, sanctions in document.content.items():
            if sanctions:
                print("a")
                num = 0
                for sanction in sanctions:
                    _sanctions += f"{type} {num}:\n```{sanction['razon']}```\n"
                    num += 1

            else: _sanctions = "No tiene sanciones hasta el momento"

    else: _sanctions = "No tiene sanciones hasta el momento"

    return _sanctions

def reports(document: tools.db.Document):
    reports = ""

    if document.exists and document.content:
        for key, value in document.content.items():
            if key == "report_id": continue

            else: 
                _id = str(value['id'])
                _author = str(value['author'])
                _report = value['report']

                reports += f"{key}:\nID: `{_id}`\nAutor: `{_author}`\Contenido:\n```{_report}```\n"

    else: reports = "No tiene reportes hasta el momento"

    return reports

@tools.bot.group()
@tools.commands.has_permissions(view_audit_log = True)
async def history(ctx: tools.commands.Context):
    # translations = tools.utils.translations(index.commands.get_config(ctx), "commands/history")
    if ctx.invoked_subcommand is None:
        async with ctx.typing():
            document = tools.db.Document(collection = f"{ctx.guild.id}", document = "users")
            
            embed = tools.discord.Embed(
                description = "El historial de los 3 primeros usuarios, si quiere el historial de un usuario en especifico use `history user @user`",
                color = tools.discord.Colour.purple(),
                timestamp = tools.datetime.utcnow()
            )
            embed.set_author(name = f"Historial")
            
            for subcollection in document.subcollections(limit = 3):
                user = tools.bot.get_user(int(subcollection.id)) 

                embed.add_field(name = f"{user.name}", value = sanctions(subcollection.document("sanctions"))) #:nais:

            await ctx.send(embed = embed)