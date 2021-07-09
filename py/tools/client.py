import socket
import threading
import pickle

class Client():
	def __init__(self, name_event = None, dic = None, host = "localhost", port = 4000):
		self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.sock.connect((str(host), int(port)))

		recv = threading.Thread(target = self.recv)
		recv.daemon = True
		recv.start()

		if (name_event is not None and dic is not None):
			self.send_data(name_event, dic)

	def recv(self):
		while True:
			try:
				data = self.sock.recv(1024)
				if data:
					print(pickle.loads(data))
			except:
				pass

	def send_data(self, name_event, data):
		self.sock.send(pickle.dumps([name_event, data]))