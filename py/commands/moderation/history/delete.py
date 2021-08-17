import tools
from commands.moderation.history import index_subcommand as index

@index.history.command()
@tools.commands.has_permissions(view_audit_log = True)
async def delete(ctx, user: tools.discord.User, type_sanction: str, number: int):
    # translations = tools.utils.translations(index.commands.get_config(ctx), "commands/history")
    async with ctx.typing():
        collection = tools.db.Collection(collection = f"{ctx.guild.id}", document = "users", subcollection = f"{user.id}")

        type_sanction = type_sanction.lower()
        if type_sanction in ["warn", "mute", "ban"]:
            document = collection.document("sanctions")
            
            content_sanctions = document.content.get(type_sanction)
            if content_sanctions is not None:
                document.delete(type_sanction, content_sanctions[int(number)], array = True)
                msg = "Sancion eliminada"

            else:
                msg = "El usuario no contiene ese tipo de sancion"

        elif type_sanction == "report":
            document = collection.document("reports")
            
            content_report = document.content.get(f"report{number}")
            if content_report is not None:
                document.delete(f"report{number}")
                document.update("report_id", document.content.get("report_id") - 1)

                if document.content.get("report_id") == 0:
                    document.delete()

                msg = "Reporte eliminado"

            else:
                msg = "Reporte inexistente"

        else:
            msg = "Tipo de sancion incorrecta, intente con `warn`, `mute`, `ban` o `report`"

    await ctx.send(msg)