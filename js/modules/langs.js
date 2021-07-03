module.exports = ({lang, route}) => {
    if (!route) return new Error('Requiere el parametro { route }');
    try {
        const texts = require(`../../src/lang/${lang??'en'}/${route}`);
        return texts;
    } catch (error) {
        if (error.toString().startsWith('Error: Cannot find module')) {
            try {
                const textsEn = require(`../../src/lang/en/${route}`);
                return textsEn;
            } catch (err) {
                if (err.toString().startsWith('Error: Cannot find module')) return new Error(`Ruta no encontrada: "${route}"`);
                else console.log(err);
            }
        } else console.log(error);
    }
}