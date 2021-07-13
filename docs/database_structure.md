# Estructura de la db
esto puede ir cambiando con el tiempo

**Simbolos:**
> `->` sera para especificar si es una coleccion, documento, etc
> `:`  dira el tipo de dato que guarda
> `()` pequeña descripcion 
> `{}` una referencia ya que el nombre es desconocido

**Estructura:**
```markdown
id_servidor -> coleccion
├── bienvenidas -> documento
│   ├── canal : id
│   ├── mensaje : string
│   └── roles (lista de roles para dar) : list 
├── moderacion -> documento
│   ├── warns : int
│   └── message : boolean
├── suggestions -> documento
│   ├── 0 : dic
│   │   ├── sugerencia : string
│   │   ├── msg_link : string
│   │   └── user : id
│   └── num_suggest : int
├── users -> documento / subcoleccion
│   └── id_usuario -> coleccion
│       ├── sanctions -> documento
│       │   ├── warn (lista que contiene mapas con los datos de cada warn) : list
│       │   ├── mute (lista que contiene mapas con los datos de cada mute) : list
│       │   └── ban (lista que contiene mapas con los datos de cada ban) : list
│       └── reports -> documento 
│           ├── report1 (datos del reporte) : map 
│           └── report2 : map
config -> coleccion
├── id_servidor -> documento
│   ├── prefix : str
│   └── lang : str
├── bot -> documento
│   ├── prefixes (lista que contiene todos los prefijos) : list
│   └── mutes (mapa con todos los mutes) : map
notes -> coleccopm
└── id_usuario -> documento / subcoleccion
    ├── {cuaderno} -> coleccion
    │   └── {page} -> documento
    │       └── {part} (la parte de una pagina) : str 
    └── {cuaderno} (configuraciones del cuaderno) : map
```