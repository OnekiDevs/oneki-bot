import tools

@tools.bot.command()
@tools.commands.has_permissions(kick_members = True)
async def warn(ctx, member: tools.discord.Member, *, reason : str = "No se dio una razón"):
    translations = tools.utils.translations(tools.get_config(ctx), "commands/moderation/warn")
    if(member == ctx.author): await ctx.channel.send(translations["msg_1"])
    else:
        async with ctx.typing():
            collection_serv = tools.db.ctx(f"{ctx.guild.id}")
            user = tools.utils.get_user(member)
            embed = tools.discord.Embed(
                description = translations["embed"]["description"].format(ctx.guild.name),
                colour = tools.discord.Colour.from_rgb(252, 207, 3),
                timestamp = tools.datetime.utcnow()
            )
            embed.set_author(name = translations["embed"]["author"], icon_url = user.avatar_url)
            if(tools.re.search("-c", reason) is not None):
                reason = reason.split("-c")[1]
                embed.add_field(name = translations["embed"]["field_2"]["name"], value = f"```\n{ctx.author.name}\n```", inline = False)
            embed.add_field(name = translations["embed"]["field_1"]["name"], value = f"```\n{reason}\n```")
            embed.set_image(url = "https://media1.tenor.com/images/47b2b2d362a19102033a7535488d1440/tenor.gif?itemid=18361254")
            info_dic = {"razon" : reason, "time" : tools.datetime.utcnow()}
            if(collection_serv.get("users", f"{user.id}") == None): collection_serv.set("users", {"warn" : [info_dic]}, f"{user.id}", "sanctions")
            else: collection_serv.update("users", "warn", {"razon" : reason}, subcollection = f"{user.id}", subdocumnt = "sanctions", array = True)
        await ctx.send(translations["msg_2"])
        await member.send(embed = embed)