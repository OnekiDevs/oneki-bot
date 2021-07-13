import threading
import tools
import connect
import process
import env

def run(sock : tools.socket.socket, host = "localhost", port = 0):
	"""Configuracion del socket"""
	sock.bind((str(host), int(port)))
	sock.listen(10)
	sock.setblocking(False)

	accept = threading.Thread(target = lambda : connect.Connect(sock, tools.clients))
	accept.daemon = True
	accept.start()

	proces = threading.Thread(target = lambda : process.Process(tools.clients, tools.name_events))
	proces.daemon = True
	proces.start()

	print("[+] Servidor establecido")
	while True:
		pass

run(tools.sock, port = env.PORT)