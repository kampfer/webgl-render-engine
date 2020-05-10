export default class Stats {

    constructor() {

        this._entries = {};

    }

    getEntry(name, type = Stats.MAP_ENTRY) {

        let entry = this._entries[name];

        if (!entry) {

            if (type === Stats.MAP_ENTRY) {
                entry = new Map();
            } else if (type === Stats.WEAK_MAP_ENTRY) {
                entry = new WeakMap();
            }

            this._entries[name] = entry;

        }

        return entry;

    }

    removeEntry(name) {
        delete this._entries[name];
    }

}

Stats.MAP_ENTRY = 0;
Stats.WEAK_MAP_ENTRY = 1;