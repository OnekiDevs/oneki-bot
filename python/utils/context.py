from discord.ext import commands
# import discord_slash
# import discord

import json
import datetime


class Context(commands.Context):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
    @property
    def session(self):
        return self.bot.session

    @property
    def lang(self):
        return self.bot.get_raw_guild_lang(str(self.guild.id))

    def translations(self, path) -> dict:
        try:
            with open(f"resource/lang/{self.lang}/{path}.json", "r") as f:
                return json.loads(f.read())
        except(FileNotFoundError): 
            with open(f"resource/lang/en/{path}.json", "r") as f:
                return json.loads(f.read()) 

    async def log(self, message, *, embed=None, etc=True):
        # Debug channel
        channel = self.bot.get_channel(885674115615301651)

        if etc:
            message = f"log: \n{message}\ncommand: {self.command}\ntimestamp: {datetime.datetime.utcnow()}"
            print(message)

        await channel.send(message, embed=embed)
  
  
# class SlashContext(discord_slash.SlashContext):
# 	def __init__(self, **kwargs):
# 		super().__init__(**kwargs)
		
# 	@property
# 	def session(self):
# 		return self.bot.session

# 	@property
# 	def lang(self):
# 		return self.bot.languages.get(self.guild.id, "en")

# 	def translations(self, path) -> dict:
# 		try:
# 			with open(f"resource/lang/{self.lang}/{path}.json", "r") as f:
# 				return json.loads(f.read())
# 		except(FileNotFoundError): 
# 			with open(f"resource/lang/en/{path}.json", "r") as f:
# 				return json.loads(f.read()) 

# 	async def log(self, message, *, embed=None, etc=True):
# 		# Debug channel
# 		channel = self.bot.get_channel(885674115615301651)

# 		if etc:
# 			message = f"log: \n{message}\nslash_command: {self.command}\ntimestamp: {datetime.datetime.utcnow()}"
# 			print(message)

# 		await channel.send(message, embed=embed)
  
	