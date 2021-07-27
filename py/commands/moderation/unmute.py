import tools
from commands.moderation import utils


@tools.bot.command()
@tools.commands.has_permissions(kick_members = True)
async def unmute(ctx, member : tools.discord.Member):
    translations = tools.utils.translations(tools.get_config(ctx), "commands/moderation/unmute")
    async with ctx.typing():
        user = tools.utils.get_user(member)
        server_mutes = tools.mutes.get(f"{ctx.guild.id}")
        if(server_mutes.get(f"{user.id}") == None): 
            await ctx.send(translations["msg_error"].format(member.nick))
        else:
            try:
                embed = utils.embed(ctx, translations, member, ctx.author.name)
                # embed = tools.discord.Embed(
                #     description = translations["embed"]["description"],
                #     colour = tools.discord.Colour.from_rgb(178, 34, 34),
                #     timestamp = tools.datetime.utcnow()
                # )
                # embed.set_author(name = translations["embed"]["author"], icon_url = user.avatar_url)
                # embed.add_field(name = translations["embed"]["field_1"]["name"], value = f"```\n{ctx.author.name}\n```")
                embed.set_image(url = "https://cdn.discordapp.com/attachments/725140299873124372/857454565091835934/unmute.gif")

                roles = server_mutes.pop(f"{user.id}") # nos da el valor y a la vez lo borra
                await tools.utils.roles.give_list_roles(ctx.guild, member, roles)

                await ctx.send(translations["msg"].format(member.mention))
                await member.send(embed = embed)
            except: pass