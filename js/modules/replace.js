module.exports = async (text, array = []) => {
    if(!text) return new Error('Requiere el parametro "text"');
    await array.forEach((i, j) => {
        if(!i.match) return new Error(`Error en: array[${j}], match no encontrado`)
        if(!i.replace) return new Error(`Error en: array[${j}], replace no encontrado`)
        if(!(i.match.constructor === String || i.match.constructor === RegExp)) return new Error(`Error en: array[${j}].match, valor no valido, requiere RegExp o String`)
        if(!i.replace.constructor === String) return new Error(`Error en: array[${j}].replace, valor no valido, requiere String`);
        text = text.replace("{prefix}", i.replace);
    })
    return text;
}