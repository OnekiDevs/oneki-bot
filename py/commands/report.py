import tools 
from tools.utils import commands


async def _report(ctx, translations, report_message):
    print(report_message)
    print("--------------------------")
    print(translations)
    print("--------------------------")
    document = tools.db.Document(collection = f"{ctx.guild.id}", document = "report")
    if document.exists:
        print("exist")
        channel = tools.bot.get_channel(int(document.content.get("channel")))
        print(f"channel {channel}")
        embed = tools.discord.Embed(
            description = f"{report_message}",
            color = tools.discord.Colour.dark_red(),
            timestamp = tools.datetime.utcnow()
        )

        embed.set_author(name = translations["embed"]["author"].format(ctx.author), icon_url = f"{ctx.author.avatar_url}", url = f"{ctx.message.jump_url}")
        await ctx.message.delete()
        embed.add_field(name = translations["embed"]["field_author"], value = translations["embed"]["field"]["value"].format(ctx.author, ctx.author.joined_at, ctx.author.id))

        if ctx.message.mentions:
            print("mentions")
            for user in ctx.message.mentions:
                embed.add_field(name = translations["embed"]["field"]["name"], value = translations["embed"]["field"]["value"].format(ctx.author, ctx.author.joined_at, ctx.author.id))
                document_report = tools.db.Document(collection = f"{ctx.guild.id}", document = "users", subcollection = f"{user.id}", subdocument = "reports")

                map = {"id": 0, "report": report_message, "author": f"{ctx.author} / {ctx.author.id}"}
                if document_report.exists:
                    report_id = document_report.content.get("report_id")
                    map["id"] = report_id

                    document_report.update(f"report{report_id}", map)
                    document_report.update("report_id", report_id + 1)

                else: 
                    document_report.set(report_id = 1)
                    document_report.update(f"report0", map)          
        print("send")
        await channel.send(embed = embed)
        print("embed")
        await ctx.author.send(translations["correct"])
        print("translation")

    else:
        await ctx.send(translations["error"])
        print("error")


@tools.bot.command()
async def report(ctx, *, report_message):
    translations = commands.get_config(ctx, "report")
    _report(ctx, translations, report_message)
