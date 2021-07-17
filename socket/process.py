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
            for client in clients:
                try:
                    data = client.recv(1024)
                    if data:
                        d = pickle.loads(data)
                        print(d)
                        if isinstance(d, dict):
                            if d["event"] in name_events: 
                                data_to_all(clients, data, client)
                            else: 
                                client.send(pickle.dumps("Invalid event"))
                        else: 
                            client.send(pickle.dumps("Invalid data type"))
                except:
                    pass