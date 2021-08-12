import tools
from tools.utils import commands
from commands.moderation import utils


@tools.bot.command()
@tools.commands.has_permissions(kick_members = True)
async def warn(ctx, member: tools.discord.Member, *, reason : str = "No se dio una razón"):
    translations = tools.utils.translations(commands.get_config(ctx), "commands/moderation/warn")
    if(member == ctx.author): 
        await ctx.channel.send(translations["msg_1"])
    else:
        async with ctx.typing():
            user = tools.utils.get_user(member)

            # collection_serv = tools.db.ctx(f"{ctx.guild.id}")
            document = tools.db.Document(collection = f"{ctx.guild.id}", document = "users", subcollection = f"{user.id}", subdocument = "sanctions")

            embed = utils.embed(ctx, translations, member, reason)
            # embed = tools.discord.Embed(
            #     description = translations["embed"]["description"].format(ctx.guild.name),
            #     colour = tools.discord.Colour.from_rgb(252, 207, 3),
            #     timestamp = tools.datetime.utcnow()
            # )
            # embed.set_author(name = translations["embed"]["author"], icon_url = user.avatar_url)
            # if(tools.re.search("-c", reason) is not None):
            #     reason = reason.split("-c ")[1]
            #     embed.add_field(name = translations["embed"]["field_2"]["name"], value = f"```\n{ctx.author.name}\n```", inline = False)
            # embed.add_field(name = translations["embed"]["field_1"]["name"], value = f"```\n{reason}\n```")
            embed.set_image(url = "https://media1.tenor.com/images/47b2b2d362a19102033a7535488d1440/tenor.gif?itemid=18361254")

            info_warn = {"razon" : reason, "time" : tools.datetime.utcnow()}
            if document.exists:
                document.update("warn", info_warn, array = True)
            else: 
                document.set(warn = [info_warn])

        await ctx.send(translations["msg_2"])

        try: 
            await member.send(embed = embed)
        except: pass