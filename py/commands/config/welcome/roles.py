from commands.config.welcome import index_subcommand as index 

@index.welcome.command()
@index.tools.commands.has_permissions(administrator = True)
async def roles(ctx, mode, role : index.tools.discord.Role):
    translations = index.tools.utils.translations(index.tools.get_config(ctx), "commands/config/welcome")
    async with ctx.typing():
        document = index.tools.db.Document(collection = f"{ctx.guild.id}", document = "bienvenidas")

        if(mode == "add"):
            if document.exists:
                document.update("roles", f"{role.id}", array = True)

            else: 
                document.set(roles = [f"{role.id}"])

            message = translations["roles"]

        elif(mode == "delete"): 
            document.delete("roles", value = f"{role.id}", array = True)
            message = translations["roles_delete"]

    await ctx.send(message)