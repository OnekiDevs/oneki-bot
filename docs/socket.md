# Socket de config
este socket sera el que comunicará el modulo de js y py cuando se cambie la configuración de un servidor con el objetivo de modificar el mapa interno del bot.
es importante decir que el cliente del socket es independiente del modulo por lo cual el cliente de js no funcionara igual que el de py y vicerversa pero en ambos clientes se tendran que respetar las siguientes reglas  

# Valores por dar y recibir:
cuando se de un cambio al socket este entregara un **array serializado** a todos los clientes conectados, este array contendrá 2 valores
```py
map_socket = {"event" : "name_event", "server" : "id", "value" : "nuevo valor"}
```
Si lo que se da al socket no es un mapa este dara "Invalid data type"

# Eventos:
Lista de eventos registrados por el socket
* **lang**: sera para avisar cuando se cambie el lenguaje de un servidor
* **prefix**: cuando se cambie el prefijo de un servidor
todo evento que se de y no este registrado por el socket dara "Invalid event"