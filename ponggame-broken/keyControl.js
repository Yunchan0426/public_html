const KEYS = {NAN: -1, UP: 0, DOWN: 1};

class keyControlArr {
    ctrl = [];
    constructor() {
        this.ctrl = [];
    }

    addKey(key) {
        if(!this.ctrl.includes(key))
            this.ctrl.push(key);
    }

    removeKey(key) {
        const idx = this.ctrl.indexOf(key);
        if(idx > -1)
            this.ctrl.splice(idx, 1);
    }

    getKey() {
        return this.ctrl[this.ctrl.length - 1];
    }

    reset() {
        this.ctrl = [];
    }
}