import socket
import pickle
import threading

def send(sock, name_event, server : str, data : str):
	sock.send(pickle.dumps({"event" : name_event, "data" : {"server" : str(server), "value" : str(data)}}))

def __recv(sock, servers):
	while True:
			data = sock.recv(1024)
			if data:
				d = pickle.loads(data)
				event = d["event"]
				servers[d["data"]["server"]][event] = d["data"]["value"] 

def connect(servers, host: str = "localhost", port: int = 4000) -> socket.socket:
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	sock.connect((str(host), int(port)))

	recv = threading.Thread(target = lambda : __recv(sock, servers))
	recv.daemon = True
	recv.start()

	return sock