import tools
from tools.utils import commands
import requests
import aiohttp

@tools.bot.command()
async def avatar (ctx, member : tools.discord.Member = None):
    translations = commands.get_config(ctx, "avatar")

    if member == None: 
        mem = ctx.author
    else: mem = member

    async with aiohttp.ClientSession(headers={'Content-Type': 'application/json', 'Authorization': f"Bot {tools.env.TOKEN}"}) as session:
        response = await session.get(f"https://discord.com/api/v9/guilds/{ctx.guild.id}/members/{mem.id}")
        data = await response.json()
        if data['avatar'] == None:
            avatar = mem.avatar_url
        else: avatar = f"https://cdn.discordapp.com/guilds/{ctx.guild.id}/users/{mem.id}/avatars/{data['avatar']}.webp?size=2048"
        embed = tools.discord.Embed(colour = mem.color, timestamp = tools.datetime.utcnow())
        embed.set_author(name = translations["embed"]["author"].format(mem), url = avatar)
        embed.set_image(url = avatar)
        embed.set_footer(icon_url = ctx.author.avatar_url, text = translations["embed"]["footer"].format(ctx.author.name))

        await ctx.send(embed = embed)
