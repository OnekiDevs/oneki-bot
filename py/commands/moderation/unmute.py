import tools

@tools.bot.command()
@tools.commands.has_permissions(kick_members = True)
async def unmute(ctx, member : tools.discord.Member):
    translations = tools.translations(tools.get_config(ctx), "commands/moderation/unmute")
    collection_times = tools.db.ctx("times")
    dic = collection_times.get(f"{ctx.guild.id}", "mute")
    if(dic == None): await ctx.send(translations["msg_error"].format(member.nick))
    else:
        try:
            embed = tools.discord.Embed(
                description = translations["embed"]["description"],
                colour = tools.discord.Colour.from_rgb(178, 34, 34),
                timestamp = tools.datetime.utcnow()
            )
            embed.set_author(name = translations["embed"]["author"], icon_url = member.avatar_url)
            embed.add_field(name = translations["embed"]["field_1"]["name"], value = f"```\n{ctx.author.name}\n```")
            embed.set_image(url = "https://cdn.discordapp.com/attachments/725140299873124372/857454565091835934/unmute.gif")

            userid = tools.get_user(member).id
            await tools.give_list_roles(ctx.guild, member, dic[f"{userid}"]["roles"])
            collection_times.delete(f"{ctx.guild.id}", f"mute.{userid}")

            await ctx.send(translations["msg"].format(member.mention))
            await member.send(embed = embed)
        except(KeyError): await ctx.send(f"Al parecer {member.nick} no esta muteado")
