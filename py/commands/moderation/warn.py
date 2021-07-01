import discord
import tools

@tools.bot.command()
@tools.commands.has_permissions(kick_members = True)
async def warn(ctx, member: tools.discord.Member, *, reason : str = "No se dio una razón"):
    if(member == ctx.author): 
        await ctx.channel.send("No te puedes warnear a ti mismo!")
        return
    collection_serv = tools.db.ctx(f"{ctx.guild.id}")
    user = tools.get_user(member)
    embed = tools.discord.Embed(
        description = "Has sido advertido en {}".format(ctx.guild.name),
        colour = tools.discord.Colour.from_rgb(252, 207, 3),
        timestamp = tools.datetime.utcnow()
    )
    embed.set_author(name = "Warn", icon_url = user.avatar_url)
    embed.add_field(name = "Reason", value = f"```\n{reason}\n```")
    embed.set_image(url = "https://media1.tenor.com/images/47b2b2d362a19102033a7535488d1440/tenor.gif?itemid=18361254")
    if(tools.re.search("-c", reason) is not None):
            reason = reason.split("-c")[1]
            embed.add_field(name = "Moderador", value = f"```\n{ctx.author.name}\n```", inline=False)
    if(collection_serv.get("users") == None): collection_serv.set("users", {})
    if(collection_serv.get("users", None, f"{user.id}", "sanctions" )== None): collection_serv.set("users", {}, f"{user.id}", "sanctions")
    collection_serv.update("users", "warn", {"razon" : reason}, subcollection = f"{user.id}", subdocumnt = "sanctions", array = True)
    await ctx.send("Se le ha dado el warn al usuario!")
    await member.send(embed = embed)