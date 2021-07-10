import tools

@tools.bot.command()
@tools.commands.has_permissions(kick_members = True)
async def mute(ctx, member : tools.discord.Member, time = "", *, reason = "No se dio una razón"):
    translations = tools.utils.translations(tools.get_config(ctx), "commands/moderation/mute")
    if(member == ctx.author): await ctx.channel.send(translations["msg_1"])
    else:
        async with ctx.typing():
            collection_serv = tools.db.ctx(f"{ctx.guild.id}")
            collection_times = tools.db.ctx("times")
            user = tools.utils.get_user(member)

            embed = tools.discord.Embed(
                description = translations["embed"]["description"].format(ctx.guild.name),
                colour = tools.discord.Colour.from_rgb(178, 34, 34),
                timestamp = tools.datetime.utcnow()
            )
            embed.set_author(name = translations["embed"]["author"], icon_url = user.avatar_url)
            if(tools.re.search("-c", reason) is not None):
                reason = reason.split("-c ")[1]
                embed.add_field(name = translations["embed"]["field_2"]["name"], value = f"```\n{ctx.author.name}\n```", inline = False)
            embed.add_field(name = translations["embed"]["field_1"]["name"], value = f"```\n{reason}\n```")

            search = tools.re.search(r"[0-9]+[dhms]", time)
            if(search is not None):
                j = tools.re.split(r"[0-9]+", time)[1]
                num = int(tools.re.split(r"[dhms]", time)[0])
                if(j == "d"): 
                    tempo = tools.datetime.utcnow() + tools.timedelta(days = num), float(86400 * num)
                elif(j == "h"): 
                    tempo = tools.datetime.utcnow() + tools.timedelta(hours = num), float(3600 * num)
                elif(j == "m"): 
                    tempo = tools.datetime.utcnow() + tools.timedelta(minutes = num), float(60 * num)
                elif(j == "s"): 
                    tempo = tools.datetime.utcnow() + tools.timedelta(seconds = num), float(num)
            else: tempo = tools.datetime.utcnow() + tools.timedelta(minutes = 5), float(3600 * 5)
            embed.add_field(name = translations["embed"]["field_3"]["name"], value = f"```\n{tempo[0]}\n```")
            embed.set_image(url = tools.choice(translations["embed"]["gifs"]))

            roles = []
            for i in await tools.utils.remove_role(ctx.guild, member): roles.append(str(i))
            await tools.utils.give_role(ctx.guild, member, "Mute")
            if(collection_times.get(f"{ctx.guild.id}") == None): 
                collection_times.set(f"{ctx.guild.id}", {"mute" : {f"{user.id}" : {"time" : tempo[0], "roles" : roles}}})
            else: collection_times.update(f"{ctx.guild.id}", f"mute.{user.id}", {"time" : tempo[0], "roles" : roles})

            info_dic = {"razon" : reason, "time" : tools.datetime.utcnow()}
            if(collection_serv.get("users", f"{user.id}") == None): collection_serv.set("users", {"mute" : [info_dic]}, f"{user.id}", "sanctions")
            else: collection_serv.update("users", "mute", info_dic, subcollection = f"{user.id}", subdocumnt = "sanctions", array = True)

        try:
            await ctx.send(translations["msg_2"].format(member.mention))
            await member.send(embed = embed)
        except: pass
        await tools.sleep(tempo[1])
        await tools.utils.give_list_roles(ctx.guild, member, roles)
        collection_times.delete(f"{ctx.guild.id}", f"mute.{user.id}")
        await member.send(translations["msg_3"])