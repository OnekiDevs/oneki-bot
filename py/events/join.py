import tools

async def img(msg, mensaje): 
    img = tools.Image.open("src/welcome.png")
    font = tools.ImageFont.truetype("src/arial.ttf", 30)
    tools.ImageDraw.ImageDraw(img).text((210, 155), text = mensaje.format(msg.name, msg.guild.name), font = font, fill = "white")

    pfp = tools.Image.open(tools.BytesIO(await msg.avatar_url_as(format = "png", size = 128).read()))
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

@tools.bot.event
async def on_member_join(message):
    collection = tools.db.ctx(f"{message.guild.id}")
    data = collection.get("bienvenidas")
    if(data == None): pass
    else:
        roles = collection.get("bienvenidas", "roles")
        if(roles is not None and tools.is_empty(roles) == True):
            await tools.give_list_roles(message.guild, message, roles)
        try:
            channel = tools.bot.get_channel(int(data["channel"]))
            await img(message, data["message"])
            await channel.send("{0.mention}".format(message), file = tools.discord.File("src/cache.png", filename = "welcome.png"))
            tools.remove("src/cache.png")
            tools.remove("src/pfp.png")
        except(KeyError): pass