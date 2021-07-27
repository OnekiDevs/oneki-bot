import tools
from commands.moderation import utils


@tools.bot.command()
@tools.commands.has_permissions(kick_members = True)
async def mute(ctx, member : tools.discord.Member, time = "", *, reason = "No se dio una razón"):
    translations = tools.utils.translations(tools.get_config(ctx), "commands/moderation/mute")

    if(member == ctx.author): await ctx.send(translations["msg_1"])
    else:
        async with ctx.typing():

            user = tools.utils.get_user(member)


            embed = utils.embed(ctx, translations, member, reason)
            # embed = tools.discord.Embed(
            #     description = translations["embed"]["description"].format(ctx.guild.name),
            #     colour = tools.discord.Colour.from_rgb(178, 34, 34),
            #     timestamp = tools.datetime.utcnow()
            # )
            # embed.set_author(name = translations["embed"]["author"], icon_url = user.avatar_url)
            # if(tools.re.search("-c", reason) is not None):
            #     reason = reason.split("-c ")[1]
            #     embed.add_field(name = translations["embed"]["field_2"]["name"], value = f"```\n{ctx.author.name}\n```", inline = False)
            # embed.add_field(name = translations["embed"]["field_1"]["name"], value = f"```\n{reason}\n```")

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
            for role in await tools.utils.roles.remove_roles(ctx.guild, member): 
                roles.append(str(role))

            await tools.utils.roles.give_role(ctx.guild, member, "Mute")

            # Desde ahora se usaran mapas internos
            # if(collection_times.get(f"{ctx.guild.id}") == None): 
            #     collection_times.set(f"{ctx.guild.id}", {"mute" : {f"{user.id}" : {"time" : _times[0], "roles" : roles}}})
            # else: collection_times.update(f"{ctx.guild.id}", f"mute.{user.id}", {"time" : _times[0], "roles" : roles})
            server_mutes = tools.mutes.get(f"{ctx.guild.id}")
            data_roles = {f"{user.id}": roles}
            if server_mutes is not None:
                server_mutes.update(data_roles)
            else: 
                tools.mutes[f"{ctx.guild.id}"] = data_roles

            info_dic = {"razon" : reason, "time" : tools.datetime.utcnow()}
            document = tools.db.Document(collection = f"{ctx.guild.id}", document = "users", subcollection = f"{user.id}", subdocument = "sanctions")
            if document.exists: 
                document.update("mute", info_dic, array = True)
            else: 
                document.set(mute = [info_dic])

        try:
            await ctx.send(translations["msg_2"].format(member.mention))
            await member.send(embed = embed)
        except: pass

        await tools.sleep(_times[1])
        await tools.utils.roles.give_list_roles(ctx.guild, member, roles)

        await member.send(translations["msg_3"])