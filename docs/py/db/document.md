# Clase Document:
> esta clase es para manejar los documentos/subdocumentos.
> este recibe de 2 a 4 argumentos:
> `collection`       --> nombre de la coleccion donde esta el documento
> `document`           --> nombre del documento 
> `subcollection` --> nombre de la subcolección donde se guarda el subdocumento si se maneja uno
> `subdocument`     --> nombre del subdocumento por manejar si se maneja uno 

# Propiedades:
**id**: nombre del documento/subdocumento que se esta manejando
**exists**: devuelve `True` si existe el documento y `False` sino
**content**: contenido del documento/subdocumento

# Métodos:

# subcollections(limit = None)
método que devuelve tupla con las subcolecciones que contiene el documento
**Parametros:**
limit:
> limite de subcolecciones por dar, sino se da es None por lo cual entregara todas las subcolecciones
**Return:**
> tuple (Collection)

# set(\**kwargs)
método para poder establecer valores al documento (si el documento ya tiene valores estos son remplazados)
**Parametros:**
kwargs:
> valores por dar
**Return:**
> None
**Ejemplo:**
```py
import tools

collection = tools.db.Document(collection = "server_id", document = "bienvenidas")
collection.set(channel = "id", message = "un mensaje de bienvenida jaja")
```

# update(camp, value, array = False)
método para actualizar el contenido del documento
**Parametros:**
camp:
> el nombre del valor por actualizar
value:
> el nuevo valor
array:
> agregar un valor a un array, por defecto es `False`
**Return:**
> None
algo importante por resaltar es que si queremos modificar objetos anidados (un dato en un diccionario que contiene otro diccionario, etc) usaremos la notación de puntos
**Ejemplo:**
```py
# Datos de un documento
{
    'name': 'Frank',
    'favorites': {
        'food': 'Pizza',
        'color': 'Blue',
        'subject': 'Recess'
    },
    'age': 12
}
# Actualizar el dato "color" que esta en "favorites"
document.update("favorites.color", "White")
```

# delete(camp = None, array = False, value = None)
método para eliminar datos o el propio documento
**Parametros:**
camp:
> si se proporciona se elimina el campo dado
array:
> eliminar un valor en un array, por defecto es `False`
value:
> se proporciona si array es `True` (elemento por eliminar)
**Return:**
> None