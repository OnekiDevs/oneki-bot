import tools
from tools.utils import commands

def sanctions(subcollection: tools.db.Collection):
    sanctions = ""

    document = subcollection.document("sanctions")
    if document.exists and document.content:
        for key, value in document.content.items():
            num = 1 
            for sanction in value:
                sanctions += f"{key} {num}:\n```{sanction['razon']}```\n"
                num += 1

    else: sanctions = "No tiene sanciones hasta el momento"

    return sanctions

def reports(subcollection: tools.db.Collection):
    reports = ""
    if subcollection.document("reports").exists:
        for key, value in subcollection.document("reports").content.items():
            if key == "report_id": continue

            _id = str(value['id'])
            _author = str(value['author'])
            _report = value['report']

            reports += f"{key}:\nid: `{_id}`\nautor: `{_author}`\nreporte:\n```{_report}```\n"

    else: reports = "No tiene reportes hasta el momento"

    return reports

@tools.bot.group()
@tools.commands.has_permissions(administrator = True)
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

                embed.add_field(name = f"{user.name}", value = sanctions(subcollection)) #:nais:
            await ctx.send(embed = embed)