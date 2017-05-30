var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {
        //recharging
        if (creep.memory.action === 'recharging') {
            var containerId = Memory.rooms[creep.room.name].structure.container.controller;
            var container = Game.getObjectById(containerId);
            // if one was found
            if (container !== null && container.store.energy > 0) {
                creep.memory.targetId = container.id;
                creep.memory.targetType = 'HIGCT';
                creep.memory.targetRoom = creep.room.name;
            }
            else {
                var storageId = Memory.rooms[creep.room.name].structure.storage.mineral;
                var storage = Game.getObjectById(storageId);
                // if one was found
                if (storage !== null && ((_.sum(storage.store) > 0))) {
                    creep.memory.targetId = storage.id;
                    creep.memory.targetType = 'HIGSTO';
                    creep.memory.targetRoom = creep.room.name;
                }
                else {
                    var droppedSources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                    if (droppedSources) {
                        creep.memory.targetId = droppedSources.id;
                        creep.memory.targetType = 'DROP';
                        creep.memory.targetRoom = creep.room.name;
                    }
                    else {
                        creep.say('⚡?');
                    }
                }
            }
        }
    }

    if (creep.memory.targetId) {

        if (creep.memory.action === 'recharging') {
            if (creep.memory.targetType === 'LOWSTO') {
                target = Game.getObjectById(creep.memory.targetId);
                if (target) {
                    //VISUALS
                    new RoomVisual(creep.room.name).text('✅⛽', (target.pos.x), (target.pos.y));
                    if ((_.sum(target.store) > 0)) {
                        if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                        else if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_BUSY) {
                            creep.say('❗');
                        }
                        else if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_FULL) {
                            creep.say('❗');
                        }
                        else if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_TIRED) {
                            creep.say('❗');
                        }
                        else if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_INVALID_TARGET) {
                            cleanTarget(creep);
                            creep.say('❔');
                        }
                        else {
                            //VISUALS
                            new RoomVisual(creep.room.name).text('-', (target.pos.x - 0.5), (target.pos.y + 0.1), {size: 0.4, color: 'gold'});
                            new RoomVisual(creep.room.name).text('|', (target.pos.x + 0.5), (target.pos.y + 0.1), {size: 0.4, color: 'gold'});
                            new RoomVisual(creep.room.name).text('-', (target.pos.x), (target.pos.y - 0.4), {size: 0.4, color: 'gold'});
                            new RoomVisual(creep.room.name).text('|', (target.pos.x), (target.pos.y + 0.6), {size: 0.4, color: 'gold'});
                        }
                    }
                    else {
                        cleanTarget(creep);
                    }
                }
                else {
                    cleanTarget(creep);
                }
            }
            if (creep.memory.targetType === 'HIGCT') {
                target = Game.getObjectById(creep.memory.targetId);
                if (target) {
                    if (target.store.energy > 0) {
                        //VISUALS
                        new RoomVisual(creep.room.name).text('✅⛽', (target.pos.x + 0.1), (target.pos.y + 0.2), {opacity: 0.8});
                        if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {reusePath: true});
                        }
                        else if (creep.transfer(target) === ERR_BUSY) {
                            creep.say('❗');
                        }
                        else if (creep.transfer(target) === ERR_FULL) {
                            creep.say('❗');
                        }
                        else if (creep.transfer(target) === ERR_TIRED) {
                            creep.say('❗');
                        }
                        else if (creep.transfer(target) === ERR_INVALID_TARGET) {
                            cleanTarget(creep);
                            creep.say('❔');
                        }
                    }
                    else {
                        cleanTarget(creep);
                    }
                }
                else {
                    cleanTarget(creep);
                }
            }
            if (creep.memory.targetType === 'DROP') {
                targetId = creep.memory.targetId;
                dropToGet = Game.getObjectById(targetId);
                if (dropToGet) {
                    if (dropToGet.energy > 0 && dropToGet.energy !== null) {
                        //VISUALS
                        new RoomVisual(creep.room.name).text('✅⛽🔋', (dropToGet.pos.x + 0.1), (dropToGet.pos.y - 0.5), {opacity: 0.5, size: 0.5, color: 'green'});
                        if (creep.pickup(dropToGet, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(dropToGet);
                        }
                        else if (creep.pickup(dropToGet) === ERR_BUSY) {
                            creep.say('❗');
                        }
                        else if (creep.pickup(dropToGet) === ERR_FULL) {
                            creep.say('❗');
                        }
                        else if (creep.pickup(dropToGet) === ERR_TIRED) {
                            creep.say('❗');
                        }
                        else if (creep.pickup(dropToGet) === ERR_INVALID_TARGET) {
                        cleanTarget(creep);
                        creep.say('❔');
                        }
                    }
                    else {
                        cleanTarget(creep);
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



