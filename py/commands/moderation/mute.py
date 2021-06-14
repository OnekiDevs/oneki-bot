import tools

@tools.bot.command()
@tools.commands.has_permissions(kick_members = True)
async def mute(ctx, member : tools.discord.Member = None, time : str = "", *, reason  : str = "No se dio una razón"):
    collection = tools.db.ctx(f"{ctx.guild.id}")
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
        if(tools.re.search("d", time) is not None): 
            num = int(tools.re.search("d", time).string.split('d')[0])
            tempo = tools.datetime.utcnow() + tools.timedelta(days = num), float(86400 * num)
        elif(tools.re.search("h", time) is not None): 
            num = int(tools.re.search("h", time).string.split('h')[0])
            tempo = tools.datetime.utcnow() + tools.timedelta(hours = num), float(3600 * num)
        elif(tools.re.search("m", time) is not None): 
            num = int(tools.re.search("m", time).string.split('m')[0])
            tempo = tools.datetime.utcnow() + tools.timedelta(minutes = num), float(60 * num)
        elif(tools.re.search("s", time) is not None): 
            num = int(tools.re.search("s", time).string.split('s')[0])
            tempo = tools.datetime.utcnow() + tools.timedelta(seconds = num), float(num)
        else: 
            tempo = tools.datetime.utcnow() + tools.timedelta(minutes = 5)
        roles = await tools.remove_role(ctx, member)
        await tools.give_role(ctx, member, "Mute")

        await ctx.send(f"{member} a sido muteado! D:")
        await member.send(embed = embed)

        await tools.sleep(tempo[1])
        await tools.give_list_roles(ctx, member, roles)
        await member.send("Se te retiro el mute")
