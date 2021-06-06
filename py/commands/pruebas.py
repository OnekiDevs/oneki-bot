import tools

@tools.bot.command()
async def pruebas (ctx):
    return
    data = tools.db.ctx(f"850338969135611924")

    img = tools.Image.open("src/welcome.png")
    font = tools.ImageFont.truetype("Tools/arial.ttf", 30)
    tools.ImageDraw.ImageDraw(img).text((210, 155), text = data.get("bienvenidas", "mensaje").format(ctx.author.name, ctx.guild.name), font = font, fill = "white")

    pfp = tools.Image.open(tools.BytesIO (await ctx.author.avatar_url_as(size = 128).read()))
    pfp = pfp.resize((100, 100))
    bigsize = (pfp.size[0] * 3, pfp.size[1] * 3)
    mask = tools.Image.new('L', bigsize, 0)
    tools.ImageDraw.ImageDraw(mask).ellipse((0, 0) + bigsize, fill=255)
    mask = mask.resize(pfp.size, tools.Image.ANTIALIAS)
    pfp.putalpha(mask)
    output = tools.ImageOps.fit(pfp, mask.size, centering = (0.5, 0.5))
    output.putalpha(mask)
    output.save('src/pfp.png')
    
    img.paste(pfp, (89, 121), pfp)
    img.save("src/cache.png")
    await ctx.send("{0.mention}".format(ctx.author), file = tools.discord.File("src/cache.png", filename = "welcome.png"))
    tools.remove("src/cache.png")
    tools.remove("src/pfp.png")