clients = []

def Connect(sock):
    while True:
        try:
            conn, addr = sock.accept()
            conn.setblocking(False)
            clients.append(conn)
        except:
            pass