import tools
from tools.utils import commands
from commands.moderation import utils


@tools.bot.command()
@tools.commands.has_permissions(manage_messages=True)
async def unmute(ctx, member : tools.discord.Member):
    translations = commands.get_config(ctx, "moderation/unmute")
    async with ctx.typing():
        user = tools.utils.get_user(member)
        server_mutes = tools.mutes.get(f"{ctx.guild.id}")
        if(server_mutes.get(f"{user.id}") == None): 
            await ctx.send(translations["msg_error"].format(member.nick))

        else:
            try:
                embed = utils.embed(ctx.guild, ctx.author, translations, member, ctx.author.name)

                embed.set_image(url = "https://cdn.discordapp.com/attachments/725140299873124372/857454565091835934/unmute.gif")

                info = server_mutes.pop(f"{user.id}") # nos da el valor y a la vez lo borra
                await utils.roles.give_list_roles(ctx.guild, member, info['roles'])
                await utils.roles.remove_role(ctx.guild, member, "Mute")

                await ctx.send(translations["msg"].format(member.mention))
                await member.send(embed = embed)

            except: pass