import tools

@tools.bot.command()
async def info(ctx, member : tools.discord.Member = None):
    translations = tools.translations(tools.get_config(ctx), "commands/info")
    if(member == None): member = ctx.author
    roles = ""
    for role in member.roles: roles = "{0} {1.mention}".format(roles, role)

    user = tools.get_user(member)
    embed = tools.discord.Embed(
        title = translations["embed"]["title"], 
        description = f"{roles}", 
        timestamp = tools.datetime.utcnow(), 
        color = ctx.author.color
    )
    embed.set_author(name = f"{member}", url = member.avatar_url)
    embed.set_thumbnail(url = member.avatar_url)
    if(member.activity != None): 
        if(type(member.activity) == tools.discord.CustomActivity): 
            embed.add_field(name = translations["embed"]["field_1"]["name"], value = f"```{member.activity}```", inline = False)
        else:
            embed.add_field(name = translations["embed"]["field_1"]["name"], value = f"```{member.activity.name}```", inline = False)
    embed.add_field(name = translations["embed"]["field_2"]["name"], value = f"```{user.created_at}```")
    embed.add_field(name = translations["embed"]["field_3"]["name"], value = f"```{member.joined_at}```")
    embed.add_field(name = translations["embed"]["field_4"]["name"], value = f"```{member.color}```")
    embed.add_field(name = translations["embed"]["field_5"]["name"], value = f"```{user.id}```")
    embed.add_field(name = translations["embed"]["field_6"]["name"], value = f"```{member.raw_status}```")
    embed.set_footer(icon_url = ctx.author.avatar_url, text = translations["embed"]["footer"].format(ctx.guild.name))

    await ctx.send(embed = embed)