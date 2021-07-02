const utiles = require('./util');
(async ()=>{
    const lang = await utiles.replace("{prefix}Texto de prueba", [
        {
            match: "{prefix}",
            replace: prefix
        }
    ]); // retorna ">Texto de prueba"
    console.log(lang);
})();

