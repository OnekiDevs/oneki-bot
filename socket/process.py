import pickle

name_events = [
	"lang",
	"prefix"
]

def data_to_all(clients : list, data, client):
    for c in clients:
        try:
            if c != client:
                c.send(data)
        except:
            clients.remove(c)

def Process(clients : list):
    while True:
        if (len(clients) > 0):
            print(clients)
            for c in clients:
                try:
                    data = c.recv(1024)
                    if data:
                        d = pickle.loads(data)
                        if isinstance(d, dict):
                            if d["event"] in name_events: 
                                data_to_all(clients, data, c)
                            else: 
                                c.send(pickle.dumps("Invalid event"))
                        else: 
                            c.send(pickle.dumps("Invalid data type"))
                except:
                    pass