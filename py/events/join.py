import tools

@tools.bot.event
async def on_member_join(message):
    channel = Client.bot.get_channel()

    img = tools.Image.open("src/welcome.png")
    font = tools.ImageFont.truetype("Tools/arial.ttf", 30)
    tools.ImageDraw.ImageDraw(img).text((210, 155), text = f"{message.name} Bienvenido a {message.guild.name}!", font = font, fill = "white")

    pfp = tools.Image.open(tools.BytesIO (await message.avatar_url_as(size = 128).read()))
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
    await channel.send("{0.mention}".format(message), file = tools.discord.File("src/cache.png", filename = "welcome.png", spoiler = True))
    tools.remove("src/cache.png")
    tools.remove("src/pfp.png")