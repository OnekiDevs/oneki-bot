# Clase Collection:
> como dije esta clase es para manejar colecciones.
> este recibe de 1 a 3 parametros:
> `collection`    --> nombre de la coleccion
> `document`      --> nombre del documento donde esta la subcoleccion por manejar 
> `subcollection` --> nombre de la subcoleccion 
> para manejar subcolecciones se tiene que proporcionar `document` y `subcollection`

# Propiedades:
**id**: el nombre de la colección/subcolección, util cuando recorres una lista de colecciones  

# Métodos:

# documents(limit = None): 
método que te da una tupla de los documentos que contiene la colección, util cuando se trabaja con subcolecciones 
**Parametros:**
limit:
> limite de documentos por dar, sino se da es None por lo cual entregara todos los documentos
**Return:**
> tuple (Document)

# document(document)
> método para obtener un documento exacto
**Parametros:**
document:
> nombre del documento por rescatar
**Return:**
> Document

# set(id: str, \**kwargs)
> método para crear documentos dentro de la colección/subcolección
**Parametros:**
id:
> nombre del nuevo documento
kwargs:
> valores que se dan al crear el documento
**Return:**
> None
**Ejemplo:**     
```py
import tools

collection = tools.db.Collection(collection = "server_id")
collection.set("bienvenidas", channel = "id", message = "un mensaje de bienvenida jaja")
```

# delete()
> método para eliminar la colección/subcolección
**Return:**
> None

# where(filter, operation, value)
> método para realizar consultas 
**Parametros:**
> creo que es obvio xd
**Operadores:** 
> Estos son todos los operadores de comparación que se admiten
> `<`    -->    menor que
> `<=`  -->    menor o igual que
> `==`  -->    igual que
> `>`    -->    mayor que
> `>=`  -->    mayor que o igual que
> `!=`  -->    no igual a
> `array-contains`
> `array-contains-any`
> `in`
> `not-in`
**Return:**
> tuple (Document)
**Ejemplo:**
```py
import tools

collection = tools.db.Collection("ciudades")
collection.where('capital', '==', True)
```
este ejemplo lo que hace es mostrarte todos los datos llamados `capital` con valor `True`.