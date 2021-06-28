from discord import User, Member, PermissionOverwrite, utils, Colour

def get_user(user : User):
    return user

def is_empty(data_structure):
    if(data_structure): 
        return True
    else: return False

async def give_role(guild, member : Member, name_role):
    for role in guild.roles:
        if (role.name == name_role):
            await member.add_roles(role)
            break
        elif (not utils.get(guild.roles, name = name_role)):
            new_role = await guild.create_role(name = name_role, colour = Colour(0x242222))
            for channel in guild.text_channels: 
                await channel.set_permissions(new_role, overwrite = PermissionOverwrite(send_messages = False))
            await member.add_roles(new_role)
            break

async def remove_role(guild, member : Member, id_role = None): 
    roles = member._roles
    for role in guild.roles:
        if(role.id == id_role):
            for role2 in roles: 
                if(role2 == role.id):
                    await member.remove_roles(role)
                    return
    for role in guild.roles:
        for role2 in roles: 
            if(role.id == role2):
                await member.remove_roles(role)
    return roles

async def give_list_roles(guild, member : Member, list_roles):
    for role in guild.roles:
        for role2 in list_roles: 
            if(role.id == int(role2)):
                await member.add_roles(role)
            if(role.name == "Mute"):
                await member.remove_roles(role)