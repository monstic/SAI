var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {
        if (creep.memory.homeroom !== creep.room.name) {
            moveToByPath(creep, Memory.rooms[creep.memory.homeroom].spawns[creep.memory.homespawn]);
        }
        else {
            if (Memory.rooms[creep.room.name].structure.container.controller) {
                var containerId = Memory.rooms[creep.room.name].structure.container.controller;
                var container = Game.getObjectById(containerId);
                // if one was found
                if (container !== null && container.store.energy > 0) {
                    setTarget(creep, container.id, 'HIGCT', container.pos.roomName);
                }
            }
            else {
                var storageId = Memory.rooms[creep.room.name].structure.storage.mineral;
                var storage = Game.getObjectById(storageId);
                // if one was found
                if (storage !== null && storage.store[RESOURCE_ENERGY] > 0) {
                    setTarget(creep, storage.id, 'HIGSTO', storage.pos.roomName);
                }
                else {
                    var droppedSources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                    if (droppedSources) {
                        setTarget(creep, droppedSources.id, 'DROP', droppedSources.room.name);
                    }
                    else {
                        creep.say('⛽?');
                        creep.memory.action = 'undefined';
                    }
                }
            }
        }
    }

    if (creep.memory.targetId) {

        if (creep.memory.targetType === 'HIGSTO') {
            target = Game.getObjectById(creep.memory.targetId);
            if (target) {
                if (target.pos.roomName !== creep.room.name) {
                    creep.moveTo(target);
                }
                else {
                    if ((_.sum(target.store) > 0)) {
                        if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            //VISUALS
                            new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'red', lineStyle: 'dotted', opacity: 0.2});
                            creep.moveTo(target);
                        }
                        else if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_BUSY) {
                            creep.say('!');
                        }
                        else if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_FULL) {
                            creep.say('!!');
                        }
                        else if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_TIRED) {
                            creep.say('!!!');
                        }
                        else if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_INVALID_TARGET) {
                            cleanTarget(creep);
                            creep.say('⛽?');
                        }
                        else {
                            //VISUALS
                            new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'red', lineStyle: 'dotted', opacity: 0.3});
                        }
                    }
                    else {
                        cleanTarget(creep);
                    }
                }
            }
            else {
                cleanTarget(creep);
            }
        }
        if (creep.memory.targetType === 'HIGCT') {
            target = Game.getObjectById(creep.memory.targetId);
            if (target) {
                if (target.pos.roomName !== creep.room.name) {
                    creep.moveTo(target);
                }
                    else {
                    if ((_.sum(target.store) > 0)) {
                        if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            //VISUALS
                            new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'red', lineStyle: 'dotted', opacity: 0.2});
                            creep.moveTo(target);
                        }
                        else if (creep.transfer(target) === ERR_BUSY) {
                            creep.say('!');
                        }
                        else if (creep.transfer(target) === ERR_FULL) {
                            creep.say('!!');
                        }
                        else if (creep.transfer(target) === ERR_TIRED) {
                            creep.say('!!!');
                        }
                        else if (creep.transfer(target) === ERR_INVALID_TARGET) {
                            cleanTarget(creep);
                            creep.say('⛽?');
                        }
                        else {
                            //VISUALS
                            new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'red', lineStyle: 'dotted', opacity: 0.3});
                        }
                    }
                    else {
                        cleanTarget(creep);
                    }
                }
            }
            else {
                cleanTarget(creep);
            }
        }
        if (creep.memory.targetType === 'DROP') {
            targetId = creep.memory.targetId;
            target = Game.getObjectById(targetId);
            if (target) {
                if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    //VISUALS
                    new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'yellow', lineStyle: 'dotted', opacity: 0.2});
                    creep.moveTo(target);
                }
                else if (creep.pickup(target) === ERR_BUSY) {
                    creep.say('!');
                }
                else if (creep.pickup(target) === ERR_FULL) {
                    creep.say('!!');
                }
                else if (creep.pickup(target) === ERR_TIRED) {
                    creep.say('!!!');
                }
                else if (creep.pickup(target) === ERR_INVALID_TARGET) {
                    cleanTarget(creep);
                    creep.say('?');
                }
                else {
                    //VISUALS
                    new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'yellow', lineStyle: 'dotted', opacity: 0.3});
                }
            }
            else {
                cleanTarget(creep);
            }
        }
    }

};



module.exports = creepActFunctions;
