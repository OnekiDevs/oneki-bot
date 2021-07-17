import socket
import pickle
import threading

def recv(sock, servers):
	while True:
			data = sock.recv(1024)
			if data:
				d = pickle.loads(data)
				event = d["event"]
				servers[d["data"]["server"]][event] = d["data"]["value"] 

def socket_send(name_event, server, data):
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	sock.connect(("localhost", 4000))
	sock.send(pickle.dumps({"event" : name_event, "data" : {"server" : str(server), "value" : str(data)}}))
	sock.close()

def connect(servers, host = "localhost", port = 4000):
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	sock.connect((str(host), int(port)))

	_recv = threading.Thread(target = lambda : recv(sock, servers))
	_recv.daemon = True
	_recv.start()

# socket_send("lang", 123456, input())