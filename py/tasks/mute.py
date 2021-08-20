import tools
from discord.ext import tasks
from commands.moderation import utils

async def _unmute():
    for server, mutes in tools.mutes.items():
        guild: tools.discord.Guild = tools.bot.get_guild(int(server))
        for user_id, info in mutes.items():
            member: tools.discord.Member = guild.get_member(int(user_id))
            
            if info['time'] <= tools.datetime.utcnow():
                mutes.pop(user_id) 
                await utils.roles.give_list_roles(guild, member, info['roles'])
                await utils.roles.remove_role(guild, member, "Mute")

                try:
                    await member.send("Haz sido desmuteado")
                except: pass

@tasks.loop(seconds = 3)
async def mute():
    try: 
        await _unmute()
    except RuntimeError: ...

mute.start()