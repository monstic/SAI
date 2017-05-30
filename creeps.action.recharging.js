var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {
        //recharging
        if (creep.memory.action === 'recharging') {
            if (Memory.rooms[creep.room.name].links) {
                if (Memory.rooms[creep.room.name].links.default) {
                    var priority0id = Memory.rooms[creep.room.name].links.default.to;
                    var priority0 = Game.getObjectById(priority0id);
                    var isInRange = creep.pos.findInRange(FIND_STRUCTURES, 5, { filter: (s) => (s.structureType === STRUCTURE_LINK) && s.energy > 0});
                    if ((priority0 && priority0.energy > 0) && isInRange[0]) {
                        creep.memory.targetId = priority0.id;
                        creep.memory.targetType = 'HIGST';
                        creep.memory.targetRoom = priority0.room.name;
                    }
                    else {
                        /** @type {StructureContainer} */
                        let container;
                        // if the Creep should look for containers
                        if (creep || creep !== undefined) {
                            // find closest container
                            container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0});
                            // if one was found
                            if (container !== null) {
                                creep.memory.targetId = container.id;
                                creep.memory.targetType = 'HIGCT';
                                creep.memory.targetRoom = creep.room.name;
                            }
                            else {
                                if (Memory.rooms[creep.room.name].links) {
                                    if (Memory.rooms[creep.room.name].links.default) {
                                        var priority0id = Memory.rooms[creep.room.name].links.default.to;
                                        var priority0 = Game.getObjectById(priority0id);
                                        if (priority0 && priority0.energy > 0) {
                                            creep.memory.targetId = priority0.id;
                                            creep.memory.targetType = 'HIGST';
                                            creep.memory.targetRoom = priority0.room.name;
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
                }
                else {
                    /** @type {StructureContainer} */
                    let container;
                    // if the Creep should look for containers
                    if (creep || creep !== undefined) {
                        // find closest container
                        container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0});
                        // if one was found
                        if (container !== null) {
                            creep.memory.targetId = container.id;
                            creep.memory.targetType = 'HIGCT';
                            creep.memory.targetRoom = creep.room.name;
                        }
                        else {
                            if (Memory.rooms[creep.room.name].links) {
                                if (Memory.rooms[creep.room.name].links.default) {
                                    var priority0id = Memory.rooms[creep.room.name].links.default.to;
                                    var priority0 = Game.getObjectById(priority0id);
                                    if (priority0 && priority0.energy > 0) {
                                        creep.memory.targetId = priority0.id;
                                        creep.memory.targetType = 'HIGST';
                                        creep.memory.targetRoom = priority0.room.name;
                                    }
                                }
                            }
                            else {
                                var droppedSources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                                if (droppedSources) {
                                    creep.memory.targetId = priority0.id;
                                    creep.memory.targetType = 'DROP';
                                    creep.memory.targetRoom = priority0.room.name;
                                }
                                else {
                                    creep.say('⚡?');
                                }
                            }
                        }
                    }
                }
            }
            else {
                /** @type {StructureContainer} */
                let container;
                // if the Creep should look for containers
                if (creep || creep !== undefined) {
                    // find closest container
                    container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0});
                    // if one was found
                    if (container !== null) {
                        creep.memory.targetId = container.id;
                        creep.memory.targetType = 'HIGCT';
                        creep.memory.targetRoom = creep.room.name;
                    }
                    else {
                        if (Memory.rooms[creep.room.name].links) {
                            if (Memory.rooms[creep.room.name].links.default) {
                                var priority0id = Memory.rooms[creep.room.name].links.default.to;
                                var priority0 = Game.getObjectById(priority0id);
                                if (priority0 && priority0.energy > 0) {
                                    creep.memory.targetId = priority0.id;
                                    creep.memory.targetType = 'HIGST';
                                    creep.memory.targetRoom = priority0.room.name;
                                }
                            }
                        }
                        else {
                            var droppedSources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                            if (droppedSources) {
                                creep.memory.targetId = priority0.id;
                                creep.memory.targetType = 'DROP';
                                creep.memory.targetRoom = priority0.room.name;
                            }
                            else {
                                creep.say('⚡?');
                            }
                        }
                    }
                }
            }
        }
    }

    if (creep.memory.targetId) {

        if (creep.memory.action === 'recharging') {
            if (creep.memory.targetType === 'HIGST') {
                targetId = creep.memory.targetId;
                structureToExtract = Game.getObjectById(targetId);
                if (structureToExtract) {
                    if (structureToExtract.energy > 0 && structureToExtract.energy !== null) {
                        //VISUALS
                        new RoomVisual(creep.room.name).text('⛽', (structureToExtract.pos.x + 0.1), (structureToExtract.pos.y + 0.2), {opacity: 0.8});
                        if (creep.withdraw(structureToExtract, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(structureToExtract, {reusePath: true});
                        }
                        else if (creep.withdraw(structureToExtract) === ERR_BUSY) {
                            creep.say('❗');
                        }
                        else if (creep.withdraw(structureToExtract) === ERR_FULL) {
                            creep.say('❗');
                        }
                        else if (creep.withdraw(structureToExtract) === ERR_TIRED) {
                            creep.say('❗');
                        }
                        else if (creep.withdraw(structureToExtract) === ERR_INVALID_TARGET) {
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
            if (creep.memory.targetType === 'HIGCT') {
                target = Game.getObjectById(creep.memory.targetId);
                if (target) {
                    if (target.store.energy > 0) {
                        //VISUALS
                        new RoomVisual(creep.room.name).text('⛽', (target.pos.x + 0.1), (target.pos.y + 0.2), {opacity: 0.8});
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
                        new RoomVisual(creep.room.name).text('🔋', (dropToGet.pos.x + 0.1), (dropToGet.pos.y - 0.5), {opacity: 0.5, size: 0.5, color: 'green'});
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
