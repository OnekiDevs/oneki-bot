module.exports = {
    data({guild}) {
        return {
            type: 2,
            name: 'info'
        }
    },
    run(client, interact) {
        console.log(interact);
    }
}