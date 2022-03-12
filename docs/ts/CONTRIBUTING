# Contribución

## Desarrollo local

Para comenzar el desarrollo clone el proyecto, dirijase a la carpeta en la terminal e instale las dependencias

```bash
git clone https://github.com/OnekiDevs/oneki-ts.git
cd oneki-ts
npm i
```
Si nesesita instalar las dependencias de desarollo puede hacerlo con `npm i -D`

El proyecto está hecho en TypeScript asi que puede usar el comando `npm run build` para compilar el proyecto o `npm run dev` si se desea mantener una vigilancia para compilar automacticamente

## Pruebas y Ejecución

### Variables de Entorno

Para ejecutar las pruebas es nesesario que primero se configuren algunas variables de entorno (env) y para ello existe el archivo `example.env` el cual contiene las variables nesesarias para arrancar el royecto.

Debera crear un documento identico remplazando sus valores con los requeridos y ademas de que ese documento generado debera llamarse unicamente `.env`.

> **Importante:** en este archivo se guardaran datos privados asi que se recomienda nunca publicar y/o compartir. el archivo `.gitignore` esta configurado para que `.env` no se suba al repositorio.

#### DEPLOY_COMMANDS

Esta env controla el despliegue de slash commands, Si no se desea hacer ningun despliegue de ellos lo mas recomendable es que se mantenga en `false`, sin embargo, si desea desplegar algun comando para probarlo puede cambiar su valor a `true`

#### DISCORD_TOKEN

Puede que este de mas decir que es nesesario contar con un bot de discord que puede crear desde [Discord Developers](https://discord.com/developers/applications) Si no lo ha creado aqui tiene una pequeña [guia](../discord_bot.md) para crear uno. La env debera contener el token del bot creado que la podrá conseguir en el apartado de bot y asignar a la env de `DISCORD_TOKEN`

![discord token](../discord_token.png)

#### FIREBASE_TOKEN

El bot se conecta a una base de datos firestore de [Firebase](https://firebase.google.com/) por lo que deberá crear su propia base de datos, no se preocupe, es totalmente gratis.

En su proyecto de firestore debera generar un token entrando en `"Proyect Settings" > "Service accounts"` y darle click a `"Generate new private key"`; Esto le descargara un `json` con informacion del proyecto y lo nesesario para acceder a el.

> **Importante:** este archivo dara acceso total a la base de datos por lo que no se recomienda compartir y/o publicar.

este `json` generado sera nesesario convertirlo en un `string` para poder colocarlo en una sola linea y asignarlo a la env de `FIREBASE_TOKEN`

### Ejecución

Para ejecutar una prueba, una vez configuradas las variables de entorno e instalar las dependencias con `npm i`, debera compilar primero el proyecto con el comando `npm run build` para poder arrancarlo con `npm start`. Si esta en desarrollo, un comando que le puede servir es `npm run test` que se mantendra vijilando el proyecto en cambios a archivos con extencion `.ts` para automacticamente matar el proceso, compilar y ejecutar nuevamente el proyecto.

## Desarrollo

El proyecto esta modulado para facilitar la creacion de algunas funciones.

### Comandos

Para crear un nuevo comando Es nesesario crear un archivo dentro de la carpeta `commands`. 

Existe una nomenglatura para nombrar el archivo: `command_name.command.ts`. el nombre del comando es para identificar mas facil los archivos, el `.command` es nesesario para que el `CommandMannager` del bot pueda identificarlo como un comando.

La estructura basica del archivo es la siguiente

```ts
import { CommandInteraction } from "discord.js";
import { Command, Client } from "../utils/classes";

export default class Activitie extends Command {
    constructor(client: Client) {
        super(client, {
            name: "ping",
            description: "ping pong"
        });
    }

    async run(interaction: CommandInteraction): Promise<any> {
        interaction.reply('ping')
    }
}
```

Este es un ejemplo de un comando que responde ping. El bot al leer el archivo genera un comando global con el nombre y descripcion dadas en el constructor.

#### Ejecucion del comando

El `CommandMannager` del bot ejecutara automacicamente la funcion `run` declarada al recibir una interaccion, la cual puede ser `async`, recibe un `CommandInteraction` y no espera una respuesta por lo que el `return` no es obligatorio.

#### Comandos Globales y de Gremio

en el comando de ejemplo no se especifica el tipo de comando por lo que automacticamente asume que es de tipo **global**, sin embargo puede cambiar eso especificando en el constructor el tipo de comando con el parametro `type` que recibe un `CommandType` que puedes importarlo desde `/utils/classes`

ejemplo de gremio:
```ts
constructor(client: Client) {
    super(client, {
        name: "ping",
        description: "ping pong",
        type: CommandType.guild
    });
}
```

ejemplo de global:
```ts
constructor(client: Client) {
    super(client, {
        name: "ping",
        description: "ping pong",
        type: CommandType.global
    });
}
```

#### Modificacion del comando

La clase `Command` genera la estructura automacticamente y unicamente con el nombre y descripcion, pero si se desea se puede modificar y/o agregar opciones y/o subcomandos.

Para modificar esto debe crear una funcion llamada `getData` que retorne un objeto de tipo `ApplicationCommandDataResolvable` con el nuevo comando. Esta clase es importada de `"@discordjs/builders"` y para facilitar el proceso la clase `Command` contiene una pripiedad `baseCommand` que es un `SlashCommandBuilder` el cual le servira para empezar a crear el nuevo comando. 

La funcion `getData` puede retornar una `Promise<ApplicationCommandDataResolvable>` y si el comando es de tipo gremio recibe como parametro `guild` que sera una clase `Guild` 

ejemplo de gremio:
```ts
getData(guild?: Guild): Promise<ApplicationCommandDataResolvable> {
    return new Promise((resolve) => {
        const command = this.baseCommand;
        const server = this.client.servers.get(guild?.id as string);
        if (server && server.premium)
            command.addBooleanOption((option) => option
                .setName("premium").setDescription("Active ping premium"));
        resolve(command.toJSON())
    });
}
```

ejemplo de global:
```ts
getData(): ApplicationCommandDataResolvable {
    return this.baseCommand
        .addBooleanOption((option) => option
            .setName("special").setDescription("Active special ping"))
        .toJSON()
}
```

### Server
El bot tiene una propiedad llamada `servers` la cual es una coleccion de clases `Server`; Una clase nueva con distintas propiedades y metodos nuevos y utilies para la gestion de configuraciones del gremio en cuestion. La clase es algo grande por lo que si escribes `client.servers.get('guild.id').` y presiones `ctrl` + `space` el VSC te listara todas sus propiedades y metodos con una pequeña descripcion, los parametros que nesesita y lo que retorna.

![vsc capture](../server_properties.png)

> **Nota:** si no aparece la propiedad `servers` en `client` tendras que convertir client en un `Client` (custom), ya que por defecto te arroja un `Client` de Disocrd.js
```js
;(client as Client).servers.get('guild.id')
```

### Multi Idiomas
Una de los metodos que tiene `Server` es el de `translate()` el cual es un metodo que **SE DEBE** utilizar para dar respuesta a los comandos y cualquier interaciion del bot hacia el usuario

Ocupa 2 parametros y requiere su previa configuracion. En la carpeta `lang` se debera crear un archivo JSON por cada lenguaje que acepte el bot. ejemplo:
```markdown
lang
├── en.json
└── es.json
```
dentro del archivo la estructura es la siguiente:
```json
{
    "commandName": {
        "responseName": "string {param}",
        "errorResponseName": "phrase"
    }
}
```
Donde commandName sera el nombre del comando/evento/funcion y dentro de ese objeto se podran crear cuantos objetos o proopiedades (siempre strings) requiera. Si se requiere que la frase lleve algun parametro se coloca el nombre del parametro entre llaves `{}` al estilo de python.

Es importante que todos los archivos  de lenguaje tengan la misma estructura y los nombres de las propiiedades no cambien, ejemplo:
```json
//en.json
{
    "avatar": {
        "self": "Your avatar",
        "other": "{user}'s avatar"
    }
}
//es.json
{
    "avatar": {
        "self": "Tu avatar",
        "other": "Avatar de {user}"
    }
}
```
para usar el metodo translate debera pasarle la propiedad a traducir y si requiere alguna variable se pasa como objeto en otro parametro opcional y el comando retornara la frase traducida al idioma configurado en el servidor, ejemplo:
```ts
server.translate('avatar.self') // Your avatar
server.translate('avatar.other', { user: user.username }) // oneki's avatar
```