# Herramiantas en `util`

`util` es un objeto con varias herramientas que se encuantra dentro del objeto `global` por lo que para su uso no se requiere importar o declarar

Contiene herramientas como: 
* sleep
* lang
* replace
* error
* joinVoice

## `util.sleep(milisegundos = 1000)`
Hace que la ejecucion del codigo se pare por algun tiempo

Requiere de un parámetro en milisegundos que sera el tiempo que parará

Devuelve una promesa vacia despues de pasar la cantidad de tiempo especificada

Si no se especifica un tiempo por defecto esperará un segundo

###Ejemplo:

Async Await
```js
//codigo...
await util.sleep() //espera de 1000ms(1seg)
//mas codigo...
```
then
```js
//codigo...
util.sleep(500).then(()=>{ //espera de 500ms
    //mas codigo...
})
```

## `util.lang(options)`

Lmporta las respuestas en el lenguaje especificado

Requiere de un objeto con dos propiedades: 
* `options.lang` requiere de un lenguaje en formato `'en'`, `'es'`, etc. por defecto es `'en'`
* `options.route` requiere de una ruta donde se encuentra las respuestas

Devuelve un objeto con las respuestas en el lenguaje especificado o por defecto (si el lenguaje no existe devolvera en `'en'`)

El lenguaje debera ser escrito previemente *(ver langs.md)*

###Ejemplo:
```js
// comando ping.js
const lang = util.lang({lang: 'es', route: 'commands/ping'});
message.reply(lang.reply).then(msg=>msg.reply(lang.then))
```

## `util.replace(text, array)`

Remplaza varias coincidencias en el texto por lo especificado

Requiere de 2 parametros:
* text: sera el texto base
* array: es un array de objetos que contendran: 
  * match: es un `string` o `regex` que sera el texto a buscar
  * replace: contendra el valor que remplazara a lo encontrado por `match`

Devuelve **Promise\<string>**
###Ejemplo:
con string en match y Async Await
```js
const respuesta = await util.replace('{channel} established', [
  {
    match: '{channel}',
    replace: channel.name
  }
])
console.log(respuesta)
```
con regex y then
```js
util.replace('{channel} default or {channel} {alias}', [
  {
    match: /\{channel}/g,
    replace: channel.name
  },
  {
    match: '{alias}',
    replace: db.alias
  }
]).then(respuesta=>{
  console.log(respuesta)
})
```

## `util.error(error, file)`

Lanza un error con un ping en un canal

Requiere de 2 parametros:
* error: un objeto error
* file: la ruta del error

no devuelve nada

###Ejemplo:

```js
try {
  thing();
} catch (error) {
  util.error(error, __filename)
}
```

## `util.joinVoice(options)`

Une el bot a un canal de voz

Requiere de un objero con uno o varios parametros dependiendo de lo que se pase:
* opcion 1: 
  * `options.message` un objeto **\<message>**, si se da este parametro no será nesesario ningun otro, además lanza un `message.reply()` indicando el proceso de conección.
* opcion 2:
  * `options.member` un objeto **\<member>**, si se da este parametro no será nesesario ningun otro

Devuelve **\<voiceConnection>**

###Ejemplo:

con `options.message`

```js
util.joinVoice({message}).then(voiceConnections => {
  //...
}).catch(error => {
  //...
})
```

con `options.member`

```js
util.joinVoice({member:msg.member}).then(voiceConnections => {
  //...
}).catch(error => {
  //...
})
```
