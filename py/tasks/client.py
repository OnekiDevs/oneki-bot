import tools
import socket
import pickle
from discord.ext import commands, tasks

class MyCog(commands.Cog):
    def __init__(self, servers : dict, host = "localhost", port = 4000):
        self.servers = servers
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect((str(host), int(port)))
        self.recv.start()

    def cog_unload(self):
        self.recv.cancel()

    @tasks.loop()
    async def recv(self):
        try:
            data = self.sock.recv(1024)
            if data:
                print(pickle.loads(data))
        except:
            pass

tools.bot.add_cog(MyCog(tools.servers))