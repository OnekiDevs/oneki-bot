module.exports.id = 'poll'
const { MessageEmbed } = require('discord.js')
module.exports.run=async (interact, {id, option})=>{
    const polldb = await db.collection('poll').doc(id).get();
    if (!polldb.exists) return interact.reply({
        content: 'this poll is closed',
        ephemeral: true
    })
    let obj = polldb.data()
    let message = await client.channels.cache.get(obj.channel)?.messages.fetch(obj.message);
    if (!message) return interact.reply({
        content: 'this poll is closed',
        ephemeral: true
    })
    if(obj.options.find(o=>o.votes.includes(interact.user.id))?.name == option) return interact.deferUpdate()
    let votesCount = 0
    obj.options.map(o=>{
        if(o.votes.includes(interact.user.id)) o.votes.splice(o.votes.indexOf(interact.user.id), 1)
        if(o.name == option) o.votes.push(interact.user.id)
        votesCount += o.votes.length
    })
    const embed = new MessageEmbed(message.embeds[0])
    embed.fields = obj.options.map(o=>{
        return{name:`${o.name.replace('_',' ')}: ${o.value}`,value:`\`${filledBar((o.votes.length/votesCount)*100, 25)}\` ${((o.votes.length/votesCount)*100)}%`}
    })
    embed.setFooter(`Total votes: ${votesCount} | ${client.user.username} ${require('../../package.json').version}`, client.user.displayAvatarURL())
    message.edit({
        embeds: [embed]
    })
    // console.log()
    db.collection('poll').doc(id).update(obj)
    interact.deferUpdate()
}

const filledBar = (current, size) => {
    const progress = Math.round((size * (current / 100)));
    const emptyProgress = size - progress;
    const progressText = '█'.repeat(progress);
    const emptyProgressText = ' '.repeat(emptyProgress);
    const bar = progressText + emptyProgressText;
    return bar;
};