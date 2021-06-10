from discord import Member, PermissionOverwrite, utils, Colour

async def give_role_mute(ctx, member : Member):
    for role in ctx.guild.roles:
        if (role.name == "Mute"):
            await member.add_roles(role)
            break
        elif (not utils.get(ctx.guild.roles, name = "Mute")):
            new_role = await ctx.guild.create_role(name = "Mute", colour = Colour(0x242222))
            for channel in ctx.guild.text_channels: 
                await channel.set_permissions(new_role, overwrite = PermissionOverwrite(send_messages = False))
            await member.add_roles(new_role)
            break

async def remove_role_mute(member : Member): 
    roles = member.roles
    for role in roles: 
        member.remove_roles(role)
    return roles