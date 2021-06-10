import tools

@tools.bot.command()
async def avatar (ctx, member : tools.discord.Member = None):
    if (member == None): mem = ctx.author
    else: mem = member
    embed = tools.discord.Embed(colour = mem.color)
    embed.set_author(name = f"Avatar de {mem}", url = mem.avatar_url)
    embed.set_image(url = mem.avatar_url_as())
    embed.set_footer(icon_url = mem.avatar_url, text = f'Solicitado por {mem.name}')
    await ctx.send(embed = embed)