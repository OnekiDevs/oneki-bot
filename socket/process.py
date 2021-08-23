import pickle

def data_to_all(clients: list, data, client):
    for _client in clients:
        try:
            if _client != client:
                _client.send(data)
        except:
            clients.remove(_client)

def process(name_events: list, clients : list):
    while True:
        if len(clients) > 0:
            for client in clients:
                try:
                    data = client.recv(1024)
                    if data:
                        data = pickle.loads(data)
                        print(data)
                        if isinstance(data, dict):
                            if data["event"] in name_events: 
                                data_to_all(clients, data, client)

                            else: 
                                client.send(pickle.dumps("Invalid event"))

                        else: 
                            client.send(pickle.dumps("Invalid data type"))

                except:
                    pass