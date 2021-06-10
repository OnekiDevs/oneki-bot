module.exports = {
    name: 'error',
    run: async (client, error, data) => {
        console.log('Error');
        // console.log(error);
        const guild = await client.guilds.cache.get('825936007449935903');
        const channel = await guild.channels.cache.get('833780614712131616');
        channel.send(`${error} <@&832657759081463848>${data?'\n'+data:''}`);
    }
}