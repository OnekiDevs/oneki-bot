# Herramiantas en `util`

`util` es un objeto con varias herramientas que se encuantra dentro del objeto `global` por lo que para su uso no se requiere importar o declarar

Contiene herramientas como: 
* sleep
* lang
* replace
* errorEmbed

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

Devuelve una promesa de string

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
