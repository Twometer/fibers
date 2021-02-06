'use strict';

class FiberManager {

    constructor() {
        this.fibers = [];
    }

    hasFiber(key) {
        for (let fiber of this.fibers) {
            if (fiber.key == key)
                return true;
        }
        return false;
    }

    add(fiber) {
        this.fibers.push(fiber);
    }

}


module.exports = { FiberManager }