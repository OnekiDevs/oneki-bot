class myArray extends Array {
    constructor(...ar) {super(...ar)}
    toString(){return this.join(' ')}
}
class Life extends Number{
    constructor(...num) {super(...num)}
    toString(){return '<3'.repeat(this)}
}
module.exports = {
    name: "ahorcado",
    botPermissions: ['MANAGE_MESSAGES'],
    userPermissions: [],
    alias: [],
    run: async (message, args) => {

    }
};