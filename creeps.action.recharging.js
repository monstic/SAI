var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {
        //recharging
        if (creep.memory.action === 'recharging') {
            var containerId = Memory.rooms[creep.room.name].structure.container.controller;
            var container = Game.getObjectById(containerId);
            // if one was found
            if (container !== null && container.store.energy > 0) {
                setTarget(creep, container.id, 'HIGCT', container.pos.roomName);
            }
            else {
                var storageId = Memory.rooms[creep.room.name].structure.storage.mineral;
                var storage = Game.getObjectById(storageId);
                // if one was found
                if (storage !== null && ((_.sum(storage.store) > 0))) {
                    setTarget(creep, storage.id, 'HIGSTO', storage.pos.roomName);
                }
                else {
                    var droppedSources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                    if (droppedSources) {
                        setTarget(creep, droppedSources.id, 'DROP', droppedSources.pos.roomName);
                    }
                    else {
                        creep.say('?');
                    }
                }
            }
        }
    }

    if (creep.memory.targetId) {

        if (creep.memory.action === 'recharging') {
            if (creep.memory.targetType === 'HIGSTO') {
                target = Game.getObjectById(creep.memory.targetId);
                if (target) {
                    if (target.pos.roomName !== creep.room.name) {
                        moveToByPath(creep, target.pos);
                    }
                    else {
                        //VISUALS
                        new RoomVisual(creep.room.name).text('-', (target.pos.x - 0.01), (target.pos.y + 0.3));
                        if ((_.sum(target.store) > 0)) {
                            if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
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
                                creep.say('?');
                            }
                            else {
                                //VISUALS
                                new RoomVisual(creep.room.name).text('.', (target.pos.x - 0.5), (target.pos.y + 0.1), {size: 0.4, color: 'gold'});
                                new RoomVisual(creep.room.name).text('.', (target.pos.x + 0.5), (target.pos.y + 0.1), {size: 0.4, color: 'gold'});
                                new RoomVisual(creep.room.name).text('.', (target.pos.x), (target.pos.y - 0.4), {size: 0.4, color: 'gold'});
                                new RoomVisual(creep.room.name).text('.', (target.pos.x), (target.pos.y + 0.6), {size: 0.4, color: 'gold'});
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
                        moveToByPath(creep, target.pos);
                    }
                        else {
                        if ((_.sum(target.store) > 0)) {
                            //VISUALS
                            new RoomVisual(creep.room.name).text('-', (target.pos.x - 0.01), (target.pos.y + 0.3));
                            if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
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
                                creep.say('?');
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
                dropToGet = Game.getObjectById(targetId);
                if (dropToGet && creep.memory.path) {
                    if (dropToGet.pos.roomName !== creep.room.name) {
                        moveToByPath(creep, target.pos);
                    }
                    else {
                        if (dropToGet.energy > 0 && dropToGet.energy !== null) {
                            //VISUALS
                            new RoomVisual(creep.room.name).text('-', (dropToGet.pos.x - 0.01), (dropToGet.pos.y + 0.3));
                            if (creep.pickup(dropToGet, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                                creep.moveTo(dropToGet);
                            }
                            else if (creep.pickup(dropToGet) === ERR_BUSY) {
                                creep.say('!');
                            }
                            else if (creep.pickup(dropToGet) === ERR_FULL) {
                                creep.say('!!');
                            }
                            else if (creep.pickup(dropToGet) === ERR_TIRED) {
                                creep.say('!!!');
                            }
                            else if (creep.pickup(dropToGet) === ERR_INVALID_TARGET) {
                            cleanTarget(creep);
                            creep.say('?');
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
        }


    }

};



module.exports = creepActFunctions;

