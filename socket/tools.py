import socket
import pickle 

clients = []
name_events = [
	"lang",
	"prefix"
]

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)