import socket
import threading
import pickle

class Client():
	def __init__(self, servers : dict, host = "localhost", port = 5000):
		self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.sock.connect((str(host), int(port)))

		recv = threading.Thread(target = self.recv)
		recv.daemon = True
		recv.start()

		# while True:
		# 	msg = input('-> ')
			
		# 	if msg != 'exit':
		# 		self.send_data("lang", 123456, msg)
		# 	else:
		# 		self.sock.close()
		# 		exit()

	def recv(self):
		while True:
			try:
				data = self.sock.recv(1024)
				if data:
					d = pickle.loads(data)
					self.servers[d["data"]["server"]][d["event"]] = d["data"]["value"]
					print(pickle.loads(data))
			except:
				pass

	def send_data(self, name_event, server, data):
		self.sock.send(pickle.dumps({"event" : name_event, "data" : {"server" : server, "value" : data}}))

c = Client(port = 4000)