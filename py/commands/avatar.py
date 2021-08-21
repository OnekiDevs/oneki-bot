import tools
from tools.utils import commands

@tools.bot.command()
async def avatar (ctx, member : tools.discord.Member = None):
    translations = commands.get_config(ctx, "avatar")

    if member == None: 
        mem = ctx.author
    else: mem = member

    embed = tools.discord.Embed(colour = mem.color, timestamp = tools.datetime.utcnow())
    embed.set_author(name = translations["embed"]["author"].format(mem), url = mem.avatar_url)
    embed.set_image(url = mem.avatar_url_as(size = 4096))
    embed.set_footer(icon_url = ctx.author.avatar_url, text = translations["embed"]["footer"].format(ctx.author.name))

    await ctx.send(embed = embed)