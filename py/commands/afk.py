import tools
from tools.utils import commands
from tools.utils import events

@tools.bot.command()
async def afk(ctx, *, reason = "..."):
    member = ctx.message.author
    if member.id in tools.afks: 
        _, translations = events.get_config(ctx.guild, "afk")
        
        member = ctx.author
        tools.afks.pop(member.id)
        try:
            await member.edit(nick = member.display_name.replace("[AFK] ", ""))

        except tools.discord.errors.Forbidden or tools.discord.errors.HTTPException:
            if tools.discord.errors.Forbidden: 
                return await ctx.send(translations["no_permissions"])
            return ctx.send(translations["max_name_length"].format(member.mention))

        return await ctx.send(embed = tools.discord.Embed(
            title = translations["no_longer_afk"].format(member.display_name), 
            color = 0xFCE64C
        ))

    translations = tools.utils.translations(commands.get_config(ctx), "commands/afk")
    tools.afks[member.id] = "".join(reason) if reason else None

    embed = tools.discord.Embed(title = translations["afk_title"].format(member.display_name), color = 0x383FFF)
    try:
        await member.edit(nick = f"[AFK] {member.display_name}")

    except tools.discord.errors.Forbidden or tools.discord.errors.HTTPException:
        if tools.discord.errors.Forbidden: 
            return await ctx.send(translations["no_permissions"])

        return ctx.send(translations["max_name_length"].format(member.mention))

    await ctx.send(embed = embed)