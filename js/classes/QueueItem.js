'use strict';
module.exports = class QueueItem {

    resource = null;
    link = null;
    title = null;

    constructor({resource, link, title}){
        this.resource = resource;
        this.link = link;
        this.title = title;
    }

    toString(){
        return this.title??'unknown';
    }

}