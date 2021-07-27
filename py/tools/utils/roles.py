import discord


async def give_role(guild: discord.Guild, member: discord.Member, name_role: str):
    for role in guild.roles:
        if role.name == name_role:
            await member.add_roles(role)
            break
        elif not discord.utils.get(guild.roles, name = name_role):
            new_role = await guild.create_role(name = name_role, colour = discord.Colour(0x242222))
            for channel in guild.text_channels: 
                await channel.set_permissions(new_role, overwrite = discord.PermissionOverwrite(send_messages = False))
            await member.add_roles(new_role)
            break


async def remove_role(guild: discord.Guild, member : discord.Member, name_role): 
    member_roles = member.roles
    for role in guild.roles:
        if role.name == name_role:
            for member_role in member_roles: 
                if role.id == member_role:
                    await member.remove_roles(role)
                    break


async def give_list_roles(guild: discord.Guild, member: discord.Member, list_roles):
    for role in guild.roles:
        for _role in list_roles: 
            if role.id == int(_role):
                await member.add_roles(role)


async def remove_roles(guild: discord.Guild, member: discord.Member) -> tuple:
    member_roles = member._roles
    for role in guild.roles:
        for member_role in member_roles: 
            if role.id == member_role:
                await member.remove_roles(role)
    return tuple(member_roles)

