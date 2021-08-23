# Estructura de la db
esto puede ir cambiando con el tiempo

**Simbolos:**
> `->` sera para especificar si es una coleccion, documento, etc
> `:`  dira el tipo de dato que guarda
> `()` pequeña descripcion 
> `{}` una referencia ya que el nombre es desconocido

**Estructura:**
```markdown
{id_servidor} -> coleccion
├── bienvenidas -> documento
│   ├── canal: id
│   ├── mensaje: string
│   └── roles (lista de roles para dar): list 
├── moderacion -> documento
│   ├── warns: int
│   └── message: boolean
├── report -> documento 
│   └── channel: id
├── suggest -> documento / subcoleccion
│   ├── suggestions -> coleccion
│   │   └── {id} -> documento
│   │       ├── channel: id
│   │       ├── author: id
│   │       └── suggest: string
│   ├── {channel_name}: id
│   ├── lastId: int
│   └── predetermined: id
├── users -> documento / subcoleccion
│   └── {id_usuario} -> coleccion
│       ├── sanctions -> documento
│       │   ├── warn (lista que contiene mapas con los datos de cada warn): list
│       │   ├── mute (lista que contiene mapas con los datos de cada mute): list
│       │   └── ban (lista que contiene mapas con los datos de cada ban): list
│       └── reports -> documento 
│           ├── report1 (datos del reporte): map 
│           │   ├── id: int
│           │   └── report: str
│           └── report_id: int
config -> coleccion
├── {id_servidor} -> documento
│   ├── prefix: str
│   └── lang: str
├── bot -> documento
│   ├── prefixes (lista que contiene todos los prefijos): list
│   ├── afks (mapa) con todos los afk): map
│   └── mutes (mapa con todos los mutes): map
users -> coleccion
└── {id_usuario} -> documento / subcoleccion
    └── notes -> coleccion 
        └── {cuaderno} -> document
            ├── config: map 
            │   ├── description: str
            │   └── color: hex
            └── {page}: map
                └── contenido
```