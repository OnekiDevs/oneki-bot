import tools
from tools.utils import commands
from tools.utils import events

@tools.bot.command()
async def afk(ctx, *, reason = "..."):
    member = ctx.message.author
    if f"{member.id}" in tools.afks: 
        _, translations = events.get_config(ctx.guild, "afk")
        
        member = ctx.author
        tools.afks.pop(f"{member.id}")
        try:
            await member.edit(nick = member.display_name.replace("[AFK] ", ""))

        except tools.discord.errors.Forbidden or tools.discord.errors.HTTPException:
            if tools.discord.errors.Forbidden: 
                return await ctx.send(translations["no_permissions"])
            return ctx.send(translations["max_name_length"].format(member.mention))

        return await ctx.send(embed = tools.discord.Embed(
            title = translations["no_longer_afk"].format(member.display_name), 
            color = 0xFCE64C
        ), delete_after = 5.0)

    translations = commands.get_config(ctx, "afk")
    reason = "".join(reason) if reason else None

    if reason != None:
        if len(reason) > 50: return await ctx.send(translations["too_long"])
        
        results = tools.utils.check_links(reason)
        if results: return await ctx.send(translations["no_links"])

    tools.afks[f"{member.id}"] = {"reason": reason, "time": tools.datetime.utcnow()}

    embed = tools.discord.Embed(title = translations["afk_title"].format(member.display_name), color = 0x383FFF)

    if len(member.display_name) >= 27: 
        ctx.send(translations["max_name_length"].format(member.mention))
    else:   
        try:
            await member.edit(nick = f"[AFK] {member.display_name}")
        except tools.discord.errors.Forbidden:
            await ctx.send(translations["no_permissions"])

    await ctx.send(embed = embed, delete_after = 10.0)
