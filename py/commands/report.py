import tools 
from tools.utils import commands

def fiel_info(embed, user: tools.discord.User, name = "Información del usuario:"):
    embed.add_field(name = name, value = f"**Name:** `{user}`\n**Se unio:** `{user.joined_at}`\n**ID:** `{user.id}`", inline = True)

@tools.bot.command()
async def report(ctx, *, report_message):
    #translations = tools.translations(commands.get_config(ctx), "commands/report")
    async with ctx.typing():
        document = tools.db.Document(collection = f"{ctx.guild.id}", document = "report")
        if document.exists:
            channel = tools.bot.get_channel(int(document.content.get("channel")))
            
            embed = tools.discord.Embed(
                description = f"{report_message}",
                color = tools.discord.Colour.dark_red(),
                timestamp = tools.datetime.utcnow()
            )
            
            embed.set_author(name = f"Nuevo reporte de {ctx.author}", icon_url = f"{ctx.author.avatar_url}", url = f"{ctx.message.jump_url}")
            await ctx.message.delete()
            fiel_info(embed, ctx.author)
            
            if ctx.message.mentions:
                for user in ctx.message.mentions:
                    fiel_info(embed, user, "Usuario mencionado:")

                    document_report = tools.db.Document(
                        collection = f"{ctx.guild.id}", 
                        document = "users", 
                        subcollection = f"{user.id}", 
                        subdocument = "reports"
                    )

                    map = {"id": 0, "report": report_message, "author": f"{ctx.author} / {ctx.author.id}"}
                    if document_report.exists:
                        report_id = document_report.content.get("report_id")
                        document_report.update("report_id", report_id + 1)

                        map["id"] = report_id
                        document_report.update(f"report{report_id}", map)

                    else: 
                        document_report.set(report_id = 1)
                        document_report.update(f"report0", map)          

            await channel.send(embed = embed)
            await ctx.author.send("Reporte enviendo correctamente!")

        else:
            await ctx.send("Los reportes estan desactivados en este servidor")
