import tools
from tools.utils import commands
from commands.moderation import utils


@tools.bot.command()
@tools.commands.has_permissions(manage_messages=True)
async def warn(ctx, member: tools.discord.Member, *, reason : str = "No reason provided"):
    translations = tools.utils.commands.get_config(ctx, "commands/moderation/warn")
    if(member == ctx.author): 
        await ctx.channel.send(translations["msg_1"])

    else:
        async with ctx.typing():
            user = tools.utils.get_user(member)

            document = tools.db.Document(collection = f"{ctx.guild.id}", document = "users", subcollection = f"{user.id}", subdocument = "sanctions")

            embed = utils.embed(ctx.guild, ctx.author, translations, member, reason)
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