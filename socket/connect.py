import tools

def Connect(sock : tools.socket.socket, clients : list):
    while True:
        try:
            conn, addr = sock.accept()
            conn.setblocking(False)
            clients.append(conn)
        except:
            pass