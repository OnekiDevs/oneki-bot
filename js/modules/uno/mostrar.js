const canvas = require('canvas');
module.exports = async (client, interact) => {
    let partida = client.uno.get(interact.data.custom_id.slice(6))
    // partida[interact.member.user.id].cartas
    if (partida) {
        client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: partida[interact.member.user.id].cartas.join(', '),
                    components: [
                        {
                            type: 1, 
                            components: [
                                {
                                    type: 2,
                                    style: 2,
                                    custom_id: `uno_j_rg_${partida.id}`,
                                    label: "rg"
                                }
                            ]
                        }
                    ],
                    flags: 1 << 6
                }
            }
        });
    } else {
        client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 6
            }
        });
    }
}