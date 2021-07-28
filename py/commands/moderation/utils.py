import tools
from tools.utils import roles


def embed(ctx, translations, member: tools.discord.Member, value) -> tools.discord.Embed:
    user = tools.utils.get_user(member)

    embed = tools.discord.Embed(
        description = translations["embed"]["description"].format(ctx.guild.name),
        colour = tools.discord.Colour.from_rgb(178, 34, 34),
        timestamp = tools.datetime.utcnow()
    )

    embed.set_author(name = translations["embed"]["author"], icon_url = user.avatar_url)
    if(tools.re.search("-c", value) is not None):
        value = value.split("-c ")[1]
        embed.add_field(name = translations["embed"]["field_2"]["name"], value = f"```\n{ctx.author.name}\n```", inline = False)
    embed.add_field(name = translations["embed"]["field_1"]["name"], value = f"```\n{value}\n```")

    return embed