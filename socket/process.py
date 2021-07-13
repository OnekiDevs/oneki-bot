import tools

def data_to_all(clients : list, data, client):
    for c in clients:
        try:
            if c != client:
                c.send(data)
        except:
            clients.remove(c)

def Process(clients : list, name_events : list):
    while True:
        if (len(clients) > 0):
            for c in clients:
                try:
                    data = c.recv(1024)
                    if data:
                        d = tools.pickle.loads(data)
                        if isinstance(d, dict):
                            if d["event"] in name_events: 
                                data_to_all(data, c)
                            else: 
                                c.send(tools.pickle.dumps("Invalid event"))
                        else: 
                            c.send(tools.pickle.dumps("Invalid data type"))
                except:
                    pass