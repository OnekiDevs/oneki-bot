import threading
import socket

import process
import connect
import env

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
clients = []
name_events = [
	"lang",
	"prefix"
]

def run(host = "localhost", port = 4000):
	# Configuracion del socket
	sock.bind((str(host), int(port)))
	sock.listen(10)
	sock.setblocking(False)

	# Hilos
	_accept = threading.Thread(target = lambda: connect.connect(sock, clients))
	_accept.daemon = True
	_accept.start()

	_process = threading.Thread(target = lambda: process.process(name_events, clients))
	_process.daemon = True
	_process.start()

	# Servidor establecido
	print("[+] Servidor establecido")
	while True:
		pass

if __name__ == '__main__':
	run(port = env.PORT)