import tools

@tools.bot.command()
async def pruebas (ctx, user : tools.discord.User):
    """await ctx.channel.purge(limit = 1)
    await ctx.send("aun lado fabri\nhttps://tenor.com/view/modern-family-fat-kid-spray-go-away-what-gif-7354432")"""
    return

    img = tools.Image.open("src/welcome.png")
    font = tools.ImageFont.truetype("Tools/arial.ttf", 30)
    tools.ImageDraw.ImageDraw(img).text((210, 155), text = f"{user.name} Bienvenido a {ctx.guild.name}!", font = font, fill = "white")

    pfp = tools.Image.open(tools.BytesIO (await user.avatar_url_as(size = 128).read()))
    pfp = pfp.resize((100, 100))
    bigsize = (pfp.size[0] * 3, pfp.size[1] * 3)
    mask = tools.Image.new('L', bigsize, 0)
    tools.ImageDraw.ImageDraw(mask).ellipse((0, 0) + bigsize, fill=255)
    mask = mask.resize(pfp.size, tools.Image.ANTIALIAS)
    pfp.putalpha(mask)
    output = tools.ImageOps.fit(pfp, mask.size, centering = (0.5, 0.5))
    output.putalpha(mask)
    output.save('src/pfp.png')
    
    img.paste(pfp, (90, 120), pfp)
    img.save("src/cache.png")
    await ctx.send("{0.mention}".format(ctx.author), file = tools.discord.File("src/cache.png", filename = "welcome.png", spoiler = True))
    tools.remove("src/cache.png")
    tools.remove("src/pfp.png")