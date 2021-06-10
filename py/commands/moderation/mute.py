import tools

@tools.bot.command()
@tools.commands.has_permissions(kick_members = True)
async def mute(ctx, member : tools.discord.Member = None, time : str = "", *, reason  : str = "No se dio una razón"):
    return
    #En desarrollo 
    #no tocar pls :(
    collection = tools.db.ctx(f"{ctx.guild.id}")
    if(member == ctx.author): await ctx.channel.send("Lamentablemente no te puedes mutear a ti mismo")
    elif (member == None): await ctx.channel.send("Especifica el usuario al que quieres dar mute")
    else:
        embed = tools.discord.Embed(
            description = f"Oh no, has sido muteado en {ctx.guild.name} <:pepe_resistencia2:851973342658428950>",
            colour = tools.discord.Colour.from_rgb(178, 34, 34),
            timestamp = tools.datetime.utcnow()
        )
        embed.set_author(name = "Mute")
        embed.add_field(name = "Razón:", value = f"```\n{reason}\n```")
        embed.set_image(url = "https://tenor.com/view/paiton-stitch-neo-army-mod-mute-gif-18280710")
        if(tools.re.search("-i", reason) is not None):
            embed.add_field(name = "Moderador", value = f"```\n{ctx.author.name}\n```")

        if(tools.re.search("d", time) is not None): 
            tiempo = tools.datetime.utcnow() + tools.timedelta(days = int(tools.re.search("d", time).string.split('d')[0]))
        elif(tools.re.search("h", time) is not None): 
            tiempo = tools.datetime.utcnow() + tools.timedelta(hours = int(tools.re.search("h", time).string.split('h')[0]))
        elif(tools.re.search("m", time) is not None): 
            tiempo = tools.datetime.utcnow() + tools.timedelta(minutes = int(tools.re.search("m", time).string.split('m')[0]))
        elif(tools.re.search("s", time) is not None): 
            tiempo = tools.datetime.utcnow() + tools.timedelta(seconds = int(tools.re.search("s", time).string.split('s')[0]))
        else: 
            tiempo = tools.datetime.utcnow() + tools.timedelta(minutes = 5)
            reason = time + reason
        tools.give_role_mute(ctx, member)
        
        await ctx.send(f"{member} a sido muteado! D:")
        await member.send(embed = embed)