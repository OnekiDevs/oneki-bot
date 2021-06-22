import tools

@tools.bot.command()
@tools.commands.has_permissions(kick_members = True)
async def unmute(ctx, miembro : tools.discord.Member):
    tools.get_prefix(ctx, tools.serv)
    for role in ctx.guild.roles:
        if (role.name == "Mute"):
            for roles in miembro._roles:
                if(roles == role.id):
                    await miembro.remove_roles(role)
                    await ctx.send("{} a sido desmuteado! :D".format(miembro.mention))
            await ctx.send("Al parecer este usuario no esta muteado en el servidor")
