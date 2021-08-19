import tools
from tools.utils import commands
from commands.moderation import utils

@tools.bot.command()
@tools.commands.has_permissions(manage_messages=True)
async def mute(ctx, member : tools.discord.Member, time = "", *, reason = "No se dio una razón"):
    translations = tools.utils.translations(commands.get_config(ctx), "commands/moderation/mute")

    if(member == ctx.author): await ctx.send(translations["msg_1"])
    else:
        async with ctx.typing():

            user = tools.utils.get_user(member)

            embed = utils.embed(ctx, translations, member, reason)

            search = tools.re.search(r"[0-9]+[dhms]", time)
            if(search is not None):
                _time = tools.re.split(r"[0-9]+", time)[1]
                num = int(tools.re.split(r"[dhms]", time)[0])
                if(_time == "d"): 
                    _times = ( tools.datetime.utcnow() + tools.timedelta(days = num), float(86400 * num) )

                elif(_time == "h"): 
                    _times = ( tools.datetime.utcnow() + tools.timedelta(hours = num), float(3600 * num) )

                elif(_time == "m"): 
                    _times = ( tools.datetime.utcnow() + tools.timedelta(minutes = num), float(60 * num) )

                elif(_time == "s"): 
                    _times = ( tools.datetime.utcnow() + tools.timedelta(seconds = num), float(num) )

            else: _times = tools.datetime.utcnow() + tools.timedelta(minutes = 5), float(3600 * 5)

            embed.add_field(name = translations["embed"]["field_3"]["name"], value = f"```\n{_times[0]}\n```")
            embed.set_image(url = tools.choice(translations["embed"]["gifs"]))

            roles = []
            for role in await utils.roles.remove_roles(ctx.guild, member): 
                roles.append(str(role))

            await utils.roles.give_role(ctx.guild, member, "Mute")

            # Desde ahora se usaran mapas internos
            # if(collection_times.get(f"{ctx.guild.id}") == None): 
            #     collection_times.set(f"{ctx.guild.id}", {"mute" : {f"{user.id}" : {"time" : _times[0], "roles" : roles}}})
            # else: collection_times.update(f"{ctx.guild.id}", f"mute.{user.id}", {"time" : _times[0], "roles" : roles})
            server_mutes = tools.mutes.get(f"{ctx.guild.id}")
            dict_roles = {f"{user.id}": roles}
            if server_mutes is not None:
                server_mutes.update(dict_roles)

            else: 
                tools.mutes[f"{ctx.guild.id}"] = dict_roles

            info_mute = {"razon" : reason, "time" : tools.datetime.utcnow()}
            document = tools.db.Document(collection = f"{ctx.guild.id}", document = "users", subcollection = f"{user.id}", subdocument = "sanctions")
            if document.exists: 
                document.update("mute", info_mute, array = True)

            else: 
                document.set(mute = [info_mute])

        await ctx.send(translations["msg_2"].format(member.mention))

        try:
            await member.send(embed = embed)

        except: pass

        await tools.sleep(_times[1])
        await utils.roles.give_list_roles(ctx.guild, member, roles)

        await member.send(translations["msg_3"])