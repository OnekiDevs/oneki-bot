import tools

@tools.bot.command()
@tools.commands.has_permissions(kick_members = True)
async def unmute(ctx, member : tools.discord.Member):
    lang = tools.get_config(ctx)
    collection_times = tools.db.ctx("times")
    dic = collection_times.get(f"{ctx.guild.id}", "mute")
    if(dic == None): await ctx.send(f"Al parecer {member.nick} no esta muteado")
    else:
        try:
            embed = tools.discord.Embed(
                description = "Has sido desmuteado :D",
                colour = tools.discord.Colour.from_rgb(178, 34, 34),
                timestamp = tools.datetime.utcnow()
            )
            embed.set_author(name = "Unmute", icon_url = member.avatar_url)
            embed.add_field(name = "Moderador", value = f"```\n{ctx.author.name}\n```")
            embed.set_image(url = "https://cdn.discordapp.com/attachments/725140299873124372/857454565091835934/unmute.gif")

            userid = tools.get_user(member).id
            await tools.give_list_roles(ctx.guild, member, dic[f"{userid}"]["roles"])
            collection_times.delete(f"{ctx.guild.id}", f"mute.{userid}")

            await ctx.send("{} a sido desmuteado! :D".format(member.mention))
            await member.send(embed = embed)
        except(KeyError): await ctx.send(f"Al parecer {member.nick} no esta muteado")
