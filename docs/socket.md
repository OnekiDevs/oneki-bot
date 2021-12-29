# Socket de config

este socket sera el que comunicará los diferentes módulos del proyecto cuando se requiera conectar dichos módulos con el fin de comunicar algun cambio o proceso.
es importante decir que el cliente del socket es independiente del modulo por lo cual el cliente de ts no funcionara igual que el de py, etc pero en ambos clientes se tendran que respetar las siguientes reglas

# Valores por dar y recibir:

cuando se de un cambio al socket este entregara un **objeto serializado** a todos los clientes conectados, este array contendrá 2 valores

```py
map_socket = {"event" : "name_event", "data" : {...data}}
```

Si lo que se da al socket no es un mapa este dara "Invalid data type"

La propiedad `"data"` contendra distinta informacion referente al evento, sin embargo habra una propiedad que siempre estará presente: `"from"` que indicará el módulo desde donde se emite el evento `"module_ts"`, `"module_py"`, `"module_rs"`, `"module_web"`

# Eventos:

Lista de eventos registrados por el socket

-   **set_prefix**: sera para avisar cuando se establezca un único prefijo en el servidor

```json
//data object example
{
    "prefix": "!",
    "from": "module_ts",
    "guild": "1862465930478540510"
}
```

-   **add_prefix**: sera para avisar cuando se añada un prefijo a la lista de prefijos del servidor

```json
//data object example
{
    "prefix": "!",
    "prefixes": [">", "?", "!"],
    "from": "module_ts",
    "guild": "1862465930478540510"
}
```

-   **remove_prefix**: sera para avisar cuando se remueva yn prefijo de la lista de prefijos del servidor

```json
//data object example
{
    "prefix": "!",
    "prefixes": [">", "?"],
    "from": "module_ts",
    "guild": "1862465930478540510"
}
```

-   **set_guild_lang**: sera para avisar cuando se establezca un lenguaje en el servidor

```json
//data object example
{
    "lang": "es",
    "from": "module_ts",
    "guild": "1862465930478540510"
}
```

-   **set_suggest_channel**: sera para avisar cuando se estable un unico canal de sugerencias en el servidor

```json
//data object example
{
    "channel": "5965201426750345806",
    "from": "module_ts",
    "guild": "1862465930478540510"
}
```

-   **add_suggest_channel**: sera para avisar cuando se añada un canal de sugerencias en el servidor

```json
//data object example
{
    "channel": "5965201426750345806",
    "default": true,
    "alias": "games",
    "channels": [
        {
            "channel": "5965201426750345806",
            "default": true,
            "alias": "games"
        },
        {
            "channel": "1365294626750346495",
            "default": false,
            "alias": "events"
        }
    ],
    "from": "module_ts",
    "guild": "1862465930478540510"
}
```
