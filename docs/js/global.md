# Objeto `global`

El objeto `global` es un objeto con diferentes propiedades y metodos que se encuentra en cualquier archivo de codigo y se puede usar sin necesidad de declararlo y/o inicializarlo

## Contenido

Contiene muchos metodos y propiedades como:

* procces
* util
* client
* fetch
* db

### procces
contiene las variables de entorno en `procces.env`

### util
contiene herramientas utiles para el desarrollo *(ver mas en /util.md)*

### client
es el objeto cliente del bot, colocado en `global` para su facil acceso en todos los archivos

### fetch
funciona similar al `fetch` de js vanilla

### db
el objeto db de firebase, colocado en `global` para su facil acceso en todos los archivos