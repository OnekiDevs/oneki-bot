'use strict';
const {createAudioResource} = require("@discordjs/voice");
const ytdld = require('ytdl-core');
module.exports = class QueueItem {

    resource = null
    link = null
    title = null
    reproducedTimestamp = null
    guildId = null

    constructor({resource, link, title, guildId}){
        this.resource = resource
        this.link = link
        this.title = title
        this.guildId = guildId
    }

    toString(){
        return this.title??'unknown'
    }

    async restore(){
        return new QueueItem({
            ...this,
            resource: createAudioResource(this.type == 'file' ? this.link : await ytdld(this.link, { highWaterMark: 1<<25, filter: 'audioonly' }))
        })
    }

    set resource(resource) {
        this.resource = resource
    }

    get resource() {
        return this.resource
    }

    set link(link) {
        this.link = link
    }

    get link() {
        return this.link
    }

    set title(title) {
        this.title = title
    }

    get title() {
        return this.title
    }

    set reproducedTimestamp(reproducedTimestamp) {
        this.reproducedTimestamp = reproducedTimestamp
    }

    get reproducedTimestamp(){
        return this.reproducedTimestamp
    }

}