import traceback
import aiohttp
import sys

import utils
from utils import context, env
import json


description = """
Hola!, soy Oneki un bot multitareas y estare muy feliz en ayudarte en los que necesites :D
"""

initial_extensions = (
    "cogs.tournamentc",
)


def _prefix_callable(bot, msg):
    user_id = bot.user.id
    base = [f'<@!{user_id}> ', f'<@{user_id}> ']
    if msg.guild is None:
        base.append('!')
        base.append('?')
    else:
        base.extend(bot.prefixes.get(str(msg.guild.id), ['?', '!', '>']))
    return base


class OnekiBot(utils.commands.AutoShardedBot):
    def __init__(self):
        allowed_mentions = utils.discord.AllowedMentions(roles=False, everyone=False, users=True)
        intents = utils.discord.Intents(
            guilds=True,
            members=True,
            bans=True,
            emojis=True,
            voice_states=True,
            messages=True,
            reactions=True,
            typing=True,
        )
        super().__init__(
            command_prefix=_prefix_callable,
            description=description,
            allowed_mentions=allowed_mentions,
            intents=intents,
        )
        
        # self.slash = utils.discord_slash.SlashCommand(self, sync_commands=True, sync_on_cog_reload=True)
        self.session = aiohttp.ClientSession(loop=self.loop)

        # guild_id: list
        self.prefixes = self._prefixes()

        # guild_id: str(lang)
        self.languages = self._languages()

        # user_id mapped to True
        # these are users globally blacklisted
        self.blacklist = set(utils.db.Document(collection="config", document="bot").content.get("blacklist"))

        for extension in initial_extensions:
            try:
                self.load_extension(extension)
            except Exception as e:
                print(f'Failed to load extension {extension}.', file=sys.stderr)
                traceback.print_exc()

    async def on_command_error(self, ctx, error):
        if isinstance(error, utils.commands.errors.CommandNotFound): 
            pass
        else: 
            # Error message
            msg = "".join(traceback.format_exception(type(error), error, error.__traceback__))

            # Embed
            embed = utils.discord.Embed(color=utils.discord.Colour.blue(), timestamp=utils.datetime.datetime.utcnow())
            embed.set_author(name="Error", url=f"{ctx.message.jump_url}")
            embed.add_field(name="Type:", value=f"```{type(error)}```", inline = False)
            embed.add_field(name="Message:", value=f"```{ctx.message.content}```")
            embed.add_field(name="Detail:", value=f"```{error}```", inline = False)

            # Send message
            print('Ignoring exception in command {}:'.format(ctx.command))
            traceback.print_exception(type(error), error, error.__traceback__)
            
            await ctx.log(f"**Context:**\n```py\n{msg}\n```", embed=embed, etc=False)
            await ctx.send(error)


    @staticmethod
    def _prefixes():
        prefixes = {}
        collection = utils.db.Collection("config")
        for document in collection.documents():
            content = document.content
            if utils.is_empty(content) or content.get("prefixes") is None:
                continue
            else:
                prefixes[document.id] = content.get("prefixes")

        return prefixes

    @staticmethod
    def _languages():
        languages = {}
        collection = utils.db.Collection("config")
        for document in collection.documents():
            content = document.content
            if utils.is_empty(content) or content.get("lang") is None:
                continue
            else:
                languages[document.id] = content.get("lang")

        return languages

    def get_guild_prefixes(self, guild, *, local_inject=_prefix_callable):
        proxy_msg = utils.discord.Object(id=0)
        proxy_msg.guild = guild
        return local_inject(self, proxy_msg)

    def get_raw_guild_prefixes(self, guild_id):
        return self.prefixes.get(str(guild_id), ['?', '!'])

    def get_raw_guild_lang(self, guild_id):
        return self.languages.get(str(guild_id), "en")

    def add_to_blacklist(self, object_id):
        utils.db.Document(collection="config", document="bot").update("blacklist", str(object_id), array=True)
        self.blacklist.add(str(object_id))

    def remove_from_blacklist(self, object_id):
        utils.db.Document(collection="config", document="bot").delete("blacklist", str(object_id), array=True)
        self.blacklist.remove(str(object_id))

    def translations(self, guild_id, path) -> dict:
        try:
            with open(f"resource/lang/{self.get_raw_guild_lang(guild_id)}/{path}.json", "r") as f:
                return json.loads(f.read())
        except(FileNotFoundError): 
            with open(f"resource/lang/en/{path}.json", "r") as f:
                return json.loads(f.read()) 

    async def on_ready(self):
        activity = utils.discord.Activity(type=utils.discord.ActivityType.watching, name=f"{len(self.guilds)} servidores")
        await self.change_presence(status=utils.discord.Status.idle, activity=activity)
        self.process_commands
        print(f'[+] Ready: {self.user} (ID: {self.user.id})')

    async def process_commands(self, message):
        ctx = await self.get_context(message, cls=context.Context)

        if message.author.bot:
            return

        if ctx.author.id in self.blacklist:
            return

        await self.invoke(ctx)

    async def on_message(self, message):
        if message.author.bot:
            return

        # Si pingearon al bot
        if message.content == f"<@!{self.user.id}>" or message.content == f"<@{self.user}>":
            translations = self.translations(self.guild.id, "events/message")
            await message.channel.send(translations["ping"].format(self.get_raw_guild_prefixes(self.guild.id)))

        await self.process_commands(message)

    async def close(self):
        await super().close()
        await self.session.close()

    def run(self):
        token = env.TOKEN_DEV if env.TOKEN_DEV is not None else env.TOKEN
        super().run(token, reconnect=True)

