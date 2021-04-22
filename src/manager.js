'use strict';

let fibers = [];

function hasFiber(key) {
    for (let fiber of fibers) {
        if (fiber.key === key)
            return true;
    }
    return false;
}

function add(fiber) {
    fibers.push(fiber);
}

module.exports = {hasFiber, add}