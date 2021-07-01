import tools

@tools.bot.command()
@tools.commands.has_permissions(kick_members = True)
async def mute(ctx, member : tools.discord.Member, time = "", *, reason = "No se dio una razón"):
    translations = tools.translations(tools.get_config(ctx), "commands/moderation/mute")
    if(member == ctx.author): await ctx.channel.send(translations["msg_1"])
    else:
        collection_serv = tools.db.ctx(f"{ctx.guild.id}")
        collection_times = tools.db.ctx("times")
        user = tools.get_user(member)

        embed = tools.discord.Embed(
            description = translations["embed"]["description"].format(ctx.guild.name),
            colour = tools.discord.Colour.from_rgb(178, 34, 34),
            timestamp = tools.datetime.utcnow()
        )
        embed.set_author(name = translations["embed"]["author"], icon_url = user.avatar_url)
        if(tools.re.search("-c", reason) is not None):
            reason = reason.split("-c")[1]
            embed.add_field(name = translations["embed"]["field_2"]["name"], value = f"```\n{ctx.author.name}\n```", inline = False)
        embed.add_field(name = translations["embed"]["field_1"]["name"], value = f"```\n{reason}\n```")
        search = tools.re.search(r"[.d.h.m.s]", time)
        if(search is not None):
            j = search.group()
            if(j == "d"): 
                num = int(search.string.split('d')[0])
                tempo = tools.datetime.utcnow() + tools.timedelta(days = num), float(86400 * num)
            elif(j == "h"): 
                num = int(search.string.split('h')[0])
                tempo = tools.datetime.utcnow() + tools.timedelta(hours = num), float(3600 * num)
            elif(j == "m"): 
                num = int(search.string.split('m')[0])
                tempo = tools.datetime.utcnow() + tools.timedelta(minutes = num), float(60 * num)
            elif(j == "s"): 
                num = int(search.string.split('s')[0])
                tempo = tools.datetime.utcnow() + tools.timedelta(seconds = num), float(num)
        else: tempo = tools.datetime.utcnow() + tools.timedelta(minutes = 5), float(3600 * 5)
        embed.add_field(name = translations["embed"]["field_3"]["name"], value = f"```\n{tempo[0]}\n```")
        embed.set_image(url = tools.choice(translations["embed"]["gifs"]))

        async with ctx.typing():
            roles = await tools.remove_role(ctx.guild, member)
            await tools.give_role(ctx.guild, member, "Mute")
            lista = []
            for i in roles: lista.append(str(i))
            if(collection_times.get(f"{ctx.guild.id}") == None): 
                collection_times.set(f"{ctx.guild.id}", {"mute" : {f"{user.id}" : {"time" : tempo[0], "roles" : lista}}})
            else: collection_times.update(f"{ctx.guild.id}", f"mute.{user.id}", {"time" : tempo[0], "roles" : lista})
            if(collection_serv.get("users") == None): collection_serv.set("users", {}, f"{user.id}", "sanctions")
            collection_serv.update("users", "mute", {"razon" : reason, "time" : tools.datetime.utcnow()}, subcollection = f"{user.id}", subdocumnt = "sanctions", array = True)

        await ctx.send(translations["msg_2"].format(member.mention))
        await member.send(embed = embed)

        await tools.sleep(tempo[1])
        await tools.give_list_roles(ctx.guild, member, roles)
        collection_times.delete(f"{ctx.guild.id}", f"mute.{user.id}")
        await member.send(translations["msg_3"])