from discord import Member, PermissionOverwrite, utils, Colour

async def give_role(ctx, member : Member, name_role):
    for role in ctx.guild.roles:
        if (role.name == name_role):
            await member.add_roles(role)
            break
        elif (not utils.get(ctx.guild.roles, name = name_role)):
            new_role = await ctx.guild.create_role(name = name_role, colour = Colour(0x242222))
            for channel in ctx.guild.text_channels: 
                await channel.set_permissions(new_role, overwrite = PermissionOverwrite(send_messages = False))
            await member.add_roles(new_role)
            break

async def remove_role(ctx, member : Member, id_role = None): 
    roles = member._roles
    for role in ctx.guild.roles:
        if(role.id == id_role):
            for role2 in roles: 
                if(role2 == role.id):
                    await member.remove_roles(role)
                    return
    for role in ctx.guild.roles:
        for role2 in roles: 
            if(role.id == role2):
                await member.remove_roles(role)
    return roles

async def give_list_roles(ctx, member : Member, list_roles):
    for role in ctx.guild.roles:
        for role2 in list_roles: 
            if(role.id == role2):
                await member.add_roles(role)
            if(role.name == "Mute"):
                await member.remove_roles(role)