# import tools
# from discord.ext import tasks
# from commands.moderation import utils

# @tasks.loop(seconds = 1)
# async def update():
#     for server, mutes in tools.mutes.items():
#         guild = tools.bot.get_guild(int(server))
#         for user_id, info in mutes.items():
#             author = tools.bot.get_user(int(user_id))
#             try:
#                 server_mutes = tools.mutes[server]
                
#                 roles = server_mutes.pop(f"{user.id}") # nos da el valor y a la vez lo borra
#                 await utils.roles.give_list_roles(guild, member, roles)

#                 await ctx.send(translations["msg"].format(member.mention))
#                 await member.send(embed = embed)

#             except: pass

# @update.before_loop
# async def before_printer():
#     content = tools.db.Document(collection = "config", document = "bot").content
#     if (content.get("mutes") is None) or (content.get("afks") is None):
#         raise ValueError("mutes/afks tiene el valor de None")

#     else: 
#         tools.mutes = content.get("mutes")
#         tools.afks = content.get("afks")

# @update.after_loop
# async def after_update():
#     document = tools.db.Document(collection = "config", document = "bot")

#     document.update("mutes", tools.mutes)
#     document.update("afks", tools.afks)

#     print('done!')

# update.start()