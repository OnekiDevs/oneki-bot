import threading
import socket

import process
import connect
import env

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

def run(host = "localhost", port = 4000):
	"""Configuracion del socket"""
	sock.bind((str(host), int(port)))
	sock.listen(10)
	sock.setblocking(False)

	accept = threading.Thread(target = lambda : connect.Connect(sock))
	accept.daemon = True
	accept.start()

	proces = threading.Thread(target = lambda : process.Process(connect.clients))
	proces.daemon = True
	proces.start()

	print("[+] Servidor establecido")
	while True:
		pass

run(port = env.PORT)