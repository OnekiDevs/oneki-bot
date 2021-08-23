def connect(sock, clients: list):
    while True:
        try:
            conn, addr = sock.accept()
            conn.setblocking(False)
            clients.append(conn)
        except:
            pass