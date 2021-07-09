import socket
import threading
import pickle 

class Server():
	def __init__(self, host = "localhost", port = 4000):

		self.clients = []
		self.name_events = [
			"lang",
			"prefix"
		]

		self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.sock.bind((str(host), int(port)))
		self.sock.listen(10)
		self.sock.setblocking(False)

		accept = threading.Thread(target = self.connect)
		accept.daemon = True
		accept.start()

		process = threading.Thread(target = self.process)
		process.daemon = True
		process.start()

		print("[+] Servidor establecido")
		while True:
			pass


	def data_to_all(self, data, client):
		for c in self.clients:
			try:
				if c != client:
					c.send(data)
			except:
				self.clients.remove(c)

	def connect(self):
		while True:
			try:
				conn, addr = self.sock.accept()
				conn.setblocking(False)
				self.clients.append(conn)
			except:
				pass

	def process(self):
		while True:
			if (len(self.clients) > 0):
				for c in self.clients:
					try:
						data = c.recv(1024)
						if data:
							d = pickle.loads(data)
							if (type(d) == list):
								if (d[0] in self.name_events): 
									if (type(d[1]) == dict):
										self.data_to_all(data, c)
									else: c.send(pickle.dumps("Invalid data type"))
								else: c.send(pickle.dumps("Invalid event"))
							else: 
								c.send(pickle.dumps("Invalid data type"))
					except:
						pass

s = Server()