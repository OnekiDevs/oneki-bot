import tools
from tools.utils import commands
from commands.moderation import utils

@tools.bot.command()
@tools.commands.has_permissions(manage_messages=True)
async def mute(ctx, member : tools.discord.Member, time = "", *, reason = "No se dio una razón"):
    translations = commands.get_config(ctx, "moderation/mute")
    if(member == ctx.author):
         await ctx.send(translations["msg_1"])

    else:
        async with ctx.typing():
            user = tools.utils.get_user(member)
            document = tools.db.Document(collection = f"{ctx.guild.id}", document = "users", subcollection = f"{user.id}", subdocument = "sanctions")
            embed = utils.embed(ctx.guild, ctx.author, translations, member, reason)

            tiempo = utils.time(time)

            embed.add_field(name = translations["embed"]["field_3"]["name"], value = f"```\n{tiempo[2]}\n```")
            embed.set_image(url = tools.choice(translations["embed"]["gifs"]))

            roles = []
            for role in await utils.roles.remove_roles(ctx.guild, member): 
                roles.append(str(role))

            await utils.roles.give_role(ctx.guild, member, "Mute")

            mutes = tools.mutes.get(f"{ctx.guild.id}")
            info = {f"{user.id}": {"roles": roles, "time": tiempo[2]}}
            if mutes is not None:
                mutes.update(info)

            else: 
                tools.mutes[f"{ctx.guild.id}"] = info

            info = {"razon" : reason, "time" : tiempo[1]}
            if document.exists: 
                document.update("mute", info, array = True)

            else: 
                document.set(mute = [info])

        await ctx.send(translations["msg_2"].format(member.mention))
        try:
            await member.send(embed = embed)

        except: pass

        # await tools.sleep(tiempo[0])
        # await utils.roles.give_list_roles(ctx.guild, member, roles)

        # await member.send(translations["msg_3"])