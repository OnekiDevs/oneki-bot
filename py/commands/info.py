import tools

@tools.bot.command()
async def info(ctx, member : tools.discord.Member = None):
    tools.get_prefix(ctx, tools.serv)
    if(member == None): member = ctx.author

    roles = ""
    for role in member.roles: roles = "{0} {1.mention}".format(roles, role)

    embed = tools.discord.Embed(
        title = "Roles:", 
        description = f"{roles}", 
        timestamp = tools.datetime.utcnow(), 
        color = ctx.author.color
    )
    user = tools.get_user(member)
    embed.set_author(name = f"{user.name}", url = user.avatar_url)
    embed.set_thumbnail(url = user.avatar_url)
    embed.add_field(name = "Se unio al servidor: ", value = f"```{member.joined_at}```")
    embed.add_field(name = "Color: ", value = f"```{member.color}```")
    embed.add_field(name = "Estado: ", value = f"```{member.raw_status}```")
    embed.set_footer(icon_url = ctx.author.avatar_url, text = f'Solicitado por {ctx.author.name}')

    await ctx.send(embed = embed)