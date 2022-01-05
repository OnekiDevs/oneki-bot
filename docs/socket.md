# Socket de config

Este socket sera el que comunicará los diferentes módulos del proyecto cuando se requiera comunicar algun cambio o proceso.
Es importante decir que el cliente del socket es independiente del modulo por lo cual el cliente de ts no funcionara igual que el de py, etc pero en ambos clientes se tendran que respetar las siguientes reglas

# Valores por dar y recibir:

Cuando se de un mensaje al socket este entregara un **objeto serializado** a todos los clientes conectados, este array contendrá 2 valores

```py
socket_data = {"event" : "event_name", "from": "module_name", "data" : **data}
```

Si lo que se da al socket no es un dict/map este dara "Invalid data type"

La propiedad `from` contendra informacion referente al modulo desde donde se manda el mensaje:
> * `mts`: module_ts
> * `mpy`: module_py
> * `mrs`: module_rs
> * `mweb`: module_web

# Eventos:

Lista de eventos registrados por el socket

-   **set_prefix**: sera para avisar cuando se establezca un único prefijo en el servidor

```json
// socket data object example
{
    "event": "set_prefix",
    "from": "mpy",
    "data": {
        "prefix": "!",
        "guild": "1862465930478540510"
    }
}
```

-   **add_prefix**: sera para avisar cuando se añade un prefijo a la lista de prefijos del servidor

```json
// socket data object example
{
    "event": "add_prefix",
    "from": "mpy",
    "data": {
        "prefix": "!",
        "guild": "1862465930478540510"
    }
}
```

-   **remove_prefix**: sera para avisar cuando se remueva yn prefijo de la lista de prefijos del servidor

```json
// socket data object example
{
    "event": "remove_prefix",
    "from": "mpy",
    "data": {
        "prefix": "!",
        "guild": "1862465930478540510"
    }
}
```

-   **set_guild_lang**: sera para avisar cuando se establezca un lenguaje en el servidor

```json
// socket data object example
{
    "event": "set_guild_lang",
    "from": "mpy",
    "data": {
        "lang": "es",
        "guild": "1862465930478540510"
    }
}
```

-   **set_suggest_channel**: sera para avisar cuando se estable un unico canal de sugerencias en el servidor

```json
// socket data object example
{
    "event": "set_suggest_channel",
    "from": "mts",
    "data": {
        "channel": "5965201426750345806",
        "guild": "1862465930478540510"
    }
}
```

-   **add_suggest_channel**: sera para avisar cuando se añada un canal de sugerencias en el servidor

```json
// socket data object example
{
    "event": "add_suggest_channel",
    "from": "mts",
    "data": {
        "channel": "5965201426750345806",
        "guild": "1862465930478540510",
        "default": true,
        "alias": "games",
    }
}
```

-   **remove_suggest_channel**: sera para avisar cuando se elimine un canal de sugerencias en el servidor

```json
// socket data object example
{
    "event": "remove_suggest_channel",
    "from": "mts",
    "data": {
        "channel": "5965201426750345806",
        "guild": "1862465930478540510"
    }
}
```

-   **set_log**: sera para avisar cuando se agregue un canal para logs en el servidor

```json
// socket data object example
{
    "event": "set_log",
    "from": "mts",
    "data": {
        "channel": "5965201426750345806",
        "guild": "1862465930478540510",
        "log": "MESSAGE_UPDATE"
    }
}
```
