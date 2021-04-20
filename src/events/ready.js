module.exports = {
    name: 'ready',
    run: async (client) => {
        console.log('\x1b[31m%s\x1b[0m', `${client.user.username} ${client.options._tokenType} ${require('../../package.json').version} Listo y Atento!!!`);
    }
}