import tools
from tools.utils import roles

async def img(guild: tools.discord.Guild, user: tools.discord.User, mensaje): 
    # Imagen welcome
    welcome_img = tools.Image.open("src/welcome.png")
    font = tools.ImageFont.truetype("src/arial.ttf", 30)
    tools.ImageDraw.ImageDraw(welcome_img).text( 
        xy = (210, 155), 
        font = font,
        fill = "white",
        text = mensaje.format(user.name, guild.name)
    )

    # Pfp del usuario
    pfp = tools.Image.open(tools.BytesIO(await user.avatar_url_as(format = "png", size = 128).read()))
    pfp = pfp.resize((100, 100))
    bigsize = (pfp.size[0] * 3, pfp.size[1] * 3)
    mask = tools.Image.new('L', bigsize, 0)

    tools.ImageDraw.ImageDraw(mask).ellipse((0, 0) + bigsize, fill=255)
    mask = mask.resize(pfp.size, tools.Image.ANTIALIAS)
    pfp.putalpha(mask)

    output = tools.ImageOps.fit(pfp, mask.size, centering = (0.5, 0.5))
    output.putalpha(mask)
    output.save('src/pfp.png')

    welcome_img.paste(pfp, (89, 121), pfp)
    welcome_img.save("src/cache.png")

    return tools.discord.File(
        fp = "src/cache.png", 
        filename = "welcome.png",
        # spoilers = True
    )

@tools.bot.event
async def on_member_join(member):
    document = tools.db.Document(collection = f"{member.guild.id}", document = "bienvenidas")
    if document.exists:
        content = document.content
        list_roles = content.get("roles")
        if (list_roles is not None) and (tools.utils.is_empty(list_roles) == False):
            await roles.give_list_roles(member.guild, member, list_roles)

        channel_id = content.get("channel")
        if channel_id is not None:
            channel = tools.bot.get_channel(int(channel_id))

            welcome_img = await img(member.guild, member, content.get("message"))
            await channel.send("{0.mention}".format(member), file = welcome_img)

            tools.remove("src/cache.png")
            tools.remove("src/pfp.png")