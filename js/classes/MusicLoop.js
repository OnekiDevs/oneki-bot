module.exports = class MusicLoop {

    mode = 0

    constructor() {
    }

    toString() {
        return this.type
    }

    change(mode) {
        if(!mode && this.mode < 2) this.mode++
        else if (!mode) this.mode = 0
        else if (['queue', 'q'].includes(mode)) this.mode = 1
        else if (['song', 's'].includes(mode)) this.mode = 2
        else if (['deacctivate', 'd', 'disabled'].includes(mode)) this.mode = 0
        else return new Error('mode not supported')
    }

    get type() {
        return this.mode == 0 ? 'disabled' : this.mode == 1 ? 'queue' : 'song'
    }

}