# Contexto:
El modulo db contiene una clase la cual recibe como parámetro la colección a la que se quiere entrar

**Ejemplo:**
```py
import tools

collection = tools.db.ctx(f"{ctx.guild.id}")
```
asi podriamos entrar a la coleccion del servidor de donde se invoco el comando

# Método set
Método para crear documentos

**Argumentos:**
el metodo solo recibe 2 argumentos
> `documnt`      --> nombre del nuevo documento (obligatorio)
> `values`       --> el valor o los valores que contendra el documento (obligatorio)
> subcollection  --> el nombre de la subcolección donde se va a crear el documento (opcional)
> subdocumnt     --> el nombre del nuevo documento en la subcolección (obligatorio si se da una subcoleccion)

**Ejemplo:**
1. 
> Crear un documento 
> ```py
> import tools
> 
> data = {
>     'name': 'Frank',
>     'favorites': {
>         'food': 'Pizza',
>         'color': 'Blue',
>         'subject': 'Recess'
>     },
>     'age': 12
> }
> 
> coleccion = tools.db.ctx("850338969135611924")
> collecion.set("usuario1", data)
> ```

2. 
> Crear un subdocumnt
> ```py
> import tools
> 
> data = {
>     'lista' : [
>         "comprar patatas", 
>         "comer", 
>         "respirar"
>     ],
>     'cantidad' : 3
> }
> 
> coleccion = tools.db.ctx("850338969135611924")
> collecion.set("usuario1", data, "notas", "recordatorios")
> ```
**Importante:** si el documento ya existe se remplazara su contenido

# Método get:
Cuando queramos obtener los datos de un documento o sus subcolecciones usaremos el método `get`.

**Argumentos:**
este método consta de 4 parámetros, el documento, el campo, la subcolección y el subdocumento
> `documnt`         ---> el nombre del documento al que se quiere entrar 
> `camp`            ---> el nombre del dato especifico que se quiere obtener del documento (opcional)
> `subcollection`   ---> la subcolección del documento (opcional)
> `subdocumnt`      ---> el nombre del documento de la subcolección (si se brinda una subcoleccion poner este dato es obligatorio)

**Ejemplos:**
1. 
> para obtener un documento entero
> ```py
> import tools
> 
> coleccion = tools.db.ctx("850338969135611924")
> coleccion.get("usuario1")
> ```
> si el documento no existe este retornara None.

2. 
> si lo que queremos es obtener un campo en especifico seria
> ```py
> import tools
> 
> coleccion = tools.db.ctx("850338969135611924")
> coleccion.get("usuario1", "name")
> ```

3. 
> por otro lado si queremos obtener todo el documento de una subcolección seria de la siguiente manera
> ```py
> import tools
> 
> coleccion = tools.db.ctx("850338969135611924")
> coleccion.get("usuario1", subcollection = "notas", subdocumnt = "recordatorios")
> ```
> si queremos un campo en especifico agregaremos el parámetro camp

# Método update: 
Habran momentos en los que necesitemos actualizar un documento de la coleccion, para esos casos usaremos el metodo `update`

**Argumentos:**
el metodo recibe estos argumentos:
> `documnt`          --> el nombre del documento por actualizar (obligatorio)
> `camp`             --> el nombre del valor que se va cambiar (obligatorio)
> `value`            --> el nuevo valor (obligatorio)
> `subcollection`    --> si el documento esta en una subcolección puede especificar el nombre aqui (opcional)
> `subdocumnt`       --> el nombre del subdocumento (opcional aunque si se brinda una subcolección se tendrá que especificar o el metodo no hara el cambio)
> `array`            --> agregar un valor a un array, por defecto es `false` (opcional)

**Ejemplos:**
1. 
> si queremos simplemente cambiar el valor de un documento seria de la siguiente manera
> ```py
> import tools
> 
> coleccion = tools.db.ctx("850338969135611924")
> coleccion.update("usuario1", "age", 13)
> ```

2. 
> si queremos agregar un valor a un array 
> ```py
> import tools
> 
> coleccion = tools.db.ctx("850338969135611924")
> coleccion.update("usuario1", "nombre del array", "nuevo valor", array = True)
> ```

3. 
> modificar un subdocumento
> ```py
> import tools
> 
> coleccion = tools.db.ctx("850338969135611924")
> coleccion.update("usuario1", "cantidad", 4, "notas", "recordatorios")
> ```

4. 
> agregar valores a un array en un subdocumento
> ```py
> import tools
> 
> coleccion = tools.db.ctx("850338969135611924")
> coleccion.update("usuario1", "lista", "ir a dormir", "notas", "recordatorios", array = True)
> ```

**Importante:** si queremos modificar objetos anidados (un dato en un diccionario que contiene otro diccionario, etc) usaremos la notación de puntos
```py
import tools

coleccion = tools.db.ctx("850338969135611924")
coleccion.update("usuario1", "favorites.color", "White")
```

# Método delete:
Con este metodo puede borrar documentos, campos de un documento, subdocumentos y valores en un array

**Argumentos:**
el metodo contiene los siguientes argumentos:
> `documnt`           --> el nombre del documento (obligatorio)
> `camp`              --> el nombre del valor por eliminar (opcional)
> `value`             --> el valor por eliminar en un array (opcional aunque obligatorio cuando array tiene el valor `true`)
> `subcollection`     --> el nombre de la subcolección, si se quiere eliminar el documento de una subcolección indicara su nombre en este argumento (opcional)
> `subdocumnt`        --> el nombre del documento en la subcolección (opcional pero si se brinda una subcolección se tendrá que especificar o no funcionara)
> `array`             --> eliminar un valor a un array, por defecto es `false` (opcional)

**Ejemplos:**
1. 
> Si queremos borrar un documento 
> ```py
> import tools
> 
> coleccion = tools.db.ctx("850338969135611924")
> coleccion.delete("usuario1")
> ```

2. 
> Si queremos borrar el campo de un documento
> ```py
> import tools
> 
> coleccion = tools.db.ctx("850338969135611924")
> coleccion.delete("usuario1", "favorites.subject")
> ```

3. 
> Si en cambio queremos borrar el elemento de un array 
> ```py
> import tools
> 
> coleccion = tools.db.ctx("850338969135611924")
> coleccion.delete("usuario1", "nombre del array", "elemento por eliminar", array = True)
> ```

4. 
> Tambien podemos borrar el documento de una subcolección
> ```py
> import tools
> 
> coleccion = tools.db.ctx("850338969135611924")
> coleccion.delete("usuario1", subcollection = "notas", subdocumnt = "recordatorios")
> ```

5. 
> Borrar el campo de un subdocumento
> ```py
> import tools
> 
> coleccion = tools.db.ctx("850338969135611924")
> coleccion.delete("usuario1", "lista", subcollection = "notes", subdocumnt = "recordatorios")
> ```

6. 
> y por ultimo borrar el elemento de un array en un subdocumento
> ```py
> import tools
> 
> coleccion = tools.db.ctx("850338969135611924")
> coleccion.delete("usuario1", "lista", "ir a dormir", "notes", "recordatorios", array = True)
> ```

# Método where:
EL metodo where esta construido para hacer consultas simples a la db

El método where se compone por 3 parámetros, `filter`, `operation` y `value`
**Ejemplo:**
```py
import tools

coleccion = tools.db.ctx("ciudades")
coleccion.where('capital', '==', True)
```
este ejemplo lo que hace es mostrarte todas las ciudades con valor `True` en el campo `capital` osea todas las capitales.

**Operadores:** 
Estas son todas las operaciones de comparación que admite el metodo
> `<`             -->   menor que
> `<=`            -->   menor o igual que
> `==`            -->   igual que
> `>=`            -->   mayor que o igual que
> `>`             -->   mayor que
> `!=`            -->   no igual a
> `array-contains`
> `array-contains-any`
> `in`
> `not-in`