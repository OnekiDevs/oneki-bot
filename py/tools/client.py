import socket
import pickle
import threading

def send(sock, **kwargs):
	sock.send(pickle.dumps({
		"event" : kwargs.get("event"), 
		"server" : kwargs.get("server"),  
		"new_v" : kwargs.get("value"), 
	}))

def _recv(sock, servers):
	while True:
		data = sock.recv(1024)
		if data:
			data = pickle.loads(data)
			servers[ data[ "server" ] ][ data["event"] ] = data[ "new_v" ] 

def connect(servers, host: str = "localhost", port: int = 4000) -> socket.socket:
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	sock.connect((str(host), int(port)))

	recv = threading.Thread(target = lambda: _recv(sock, servers))
	recv.daemon = True
	recv.start()

	return sock