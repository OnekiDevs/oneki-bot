import tools

@tools.bot.command()
@tools.commands.has_permissions(kick_members = True)
async def mute(ctx, member : tools.discord.Member = None, time : str = "", *, reason  : str = "No se dio una razón"):
    tools.get_prefix(ctx, tools.serv)
    collection_serv = tools.db.ctx(f"{ctx.guild.id}")
    collection_times = tools.db.ctx("times")
    if(member == ctx.author): await ctx.channel.send("Lamentablemente no te puedes mutear a ti mismo")
    elif (member == None): await ctx.channel.send("Especifica el usuario al que quieres dar mute")
    else:
        embed = tools.discord.Embed(
            description = f"Oh no, has sido muteado en {ctx.guild.name} <:pepe_resistencia2:851973342658428950>",
            colour = tools.discord.Colour.from_rgb(178, 34, 34),
            timestamp = tools.datetime.utcnow()
        )
        embed.set_author(name = "Mute", icon_url = member.avatar_url)
        embed.add_field(name = "Razón:", value = f"```\n{reason}\n```")
        embed.set_image(url = tools.choice(["https://tenor.com/view/erziok-neo-army-big-boss-smash-head-mute-gif-17777559", "https://tenor.com/view/facu-neo-army-discord-john-wick-mute-gif-18280666"]))
        if(tools.re.search("-i", reason) is not None):
            embed.add_field(name = "Moderador", value = f"```\n{ctx.author.name}\n```")
        if(tools.re.search(".d", time) is not None): 
            num = int(tools.re.search("d", time).string.split('d')[0])
            tempo = tools.datetime.utcnow() + tools.timedelta(days = num), float(86400 * num)
        elif(tools.re.search(".h", time) is not None): 
            num = int(tools.re.search("h", time).string.split('h')[0])
            tempo = tools.datetime.utcnow() + tools.timedelta(hours = num), float(3600 * num)
        elif(tools.re.search(".m", time) is not None): 
            num = int(tools.re.search("m", time).string.split('m')[0])
            tempo = tools.datetime.utcnow() + tools.timedelta(minutes = num), float(60 * num)
        elif(tools.re.search(".s", time) is not None): 
            num = int(tools.re.search("s", time).string.split('s')[0])
            tempo = tools.datetime.utcnow() + tools.timedelta(seconds = num), float(num)
        else: 
            tempo = tools.datetime.utcnow() + tools.timedelta(minutes = 5), float(3600 * 5)
        user = tools.get_user(member)
        roles = await tools.remove_role(ctx.guild, member)
        await tools.give_role(ctx.guild, member, "Mute")
        """collection_times.update(f"{ctx.guild.id}", f"mute.{user.id}", {"time" : tempo[0]})
        for i in roles:
            collection_times.update(f"{ctx.guild.id}", f"mute.{user.id}.roles", i, array = True)
        collection_serv.update("users", "mute", reason, subcollection = f"{user.id}", subdocumnt = "sanctions", array = True)"""

        await ctx.send(f"{member} a sido muteado! D:")
        await member.send(embed = embed)

        await tools.sleep(tempo[1])
        await tools.give_list_roles(ctx.guild, member, roles)
        #collection_times.delete(f"{ctx.guild.id}", f"mute.{user.id}")
        await member.send("Se te retiro el mute")
