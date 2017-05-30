var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {

        if (creep.carry[RESOURCE_GHODIUM_OXIDE] > 0) {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => (s.structureType === STRUCTURE_STORAGE && s.store[RESOURCE_GHODIUM_OXIDE] < 1000000)});
            if (target !== 'undefined' && target) {
                setTarget(creep, target.id, 'LOWSTO', target.room.name);
            }
        }
        else {
            //filling
            if (creep.memory.action === 'filling') {
                var target = Game.getObjectById(Memory.rooms[creep.room.name].spawns[creep.memory.homespawn].id);

                if (target.energy < target.energyCapacity) {
                    setTarget(creep, target.id, 'LOWST', target.room.name);
                }
                else {

                    if (Memory.rooms[creep.room.name].security.underattack === 'yes') {
                        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => { return ( ((structure.structureType === STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity)))}});
                        setTarget(creep, target.id, 'LOWST', creep.room.name);
                    }
                    else {

                        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity)});
                        if (target) {
                            setTarget(creep, target.id, 'LOWST', target.room.name);
                        }
                        else {

                            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => { return ( ((structure.structureType === STRUCTURE_TOWER) && (structure.energy === 0)))}});
                            if (target) {
                                setTarget(creep, target.id, 'LOWST', target.room.name);
                            }
                            else {

                                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => { return ( ((structure.structureType === STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity)))}});
                                if (target) {
                                    setTarget(creep, target.id, 'LOWST', target.room.name);
                                }
                                else {

                                    if (Memory.rooms[creep.room.name].containers.controller) {
                                        var target = Game.getObjectById(Memory.rooms[creep.room.name].containers.controller);
                                    }
                                    // if one was found
                                    if (target !== null && target.store[RESOURCE_ENERGY] < target.storeCapacity) {
                                        setTarget(creep, Memory.rooms[creep.room.name].containers.controller, 'LOWCT', creep.room.name);
                                    }
                                    else {

                                        if (Memory.rooms[creep.room.name].storages.mineral) {
                                            var target = Game.getObjectById(Memory.rooms[creep.room.name].storages.mineral);
                                        }
                                        else {
                                            var target = null;
                                        }
                                        // if one was found
                                        if (target !== null && (_.sum(target.store) < 1000000)) {
                                            setTarget(creep, target.id, 'LOWSTO', target.room.name);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    if (creep.memory.targetId) {

        if (creep.memory.action === 'filling') {
            if (creep.memory.targetType === 'LOWST') {
                target = Game.getObjectById(creep.memory.targetId);
                if (target && target.energy !== null) {
                    //VISUALS
                    new RoomVisual(creep.room.name).text('🔌', (target.pos.x), (target.pos.y));
                    if (target.energy < target.energyCapacity) {
                        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_BUSY) {
                            cleanTarget(creep);
                            creep.say('❗');
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_FULL) {
                            cleanTarget(creep);
                            creep.say('❗');
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_TIRED) {
                            cleanTarget(creep);
                            creep.say('❗');
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_INVALID_TARGET) {
                            cleanTarget(creep);
                            creep.say('❔');
                        }
                        else {
                            //VISUALS
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x - 0.5), (target.pos.y + 0.1), {size: 0.4, color: 'gold'});
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x + 0.5), (target.pos.y + 0.1), {size: 0.4, color: 'gold'});
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x), (target.pos.y - 0.4), {size: 0.4, color: 'gold'});
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x), (target.pos.y + 0.6), {size: 0.4, color: 'gold'});
                        }
                    }
                    else {
                        cleanTarget(creep);
                    }
                }
            }
            if (creep.memory.targetType === 'LOWCT') {
                target = Game.getObjectById(creep.memory.targetId);
                if (target) {
                    //VISUALS
                    new RoomVisual(creep.room.name).text('🔌', (target.pos.x), (target.pos.y));
                    if ((_.sum(target.store) < 2000)) {
                        
                        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_BUSY) {
                            cleanTarget(creep);
                            creep.say('❗');
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_FULL) {
                            cleanTarget(creep);
                            creep.say('❗❗');
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_TIRED) {
                            cleanTarget(creep);
                            creep.say('❗❗❗');
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_INVALID_TARGET) {
                            cleanTarget(creep);
                            creep.say('❔');
                        }
                        else {
                            //VISUALS
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x - 0.5), (target.pos.y + 0.1), {size: 0.4, color: 'gold'});
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x + 0.5), (target.pos.y + 0.1), {size: 0.4, color: 'gold'});
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x), (target.pos.y - 0.4), {size: 0.4, color: 'gold'});
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x), (target.pos.y + 0.6), {size: 0.4, color: 'gold'});
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
            if (creep.memory.targetType === 'LOWSTO') {
                target = Game.getObjectById(creep.memory.targetId);
                if (target) {
                    //VISUALS
                    new RoomVisual(creep.room.name).text('🔌', (target.pos.x), (target.pos.y));
                    if ((_.sum(target.store) < 2000)) {
                        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_BUSY) {
                            creep.say('❗');
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_FULL) {
                            creep.say('❗');
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_TIRED) {
                            creep.say('❗');
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_INVALID_TARGET) {
                            cleanTarget(creep);
                            creep.say('❔');
                        }
                        else {
                            //VISUALS
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x - 0.5), (target.pos.y + 0.1), {size: 0.4, color: 'gold'});
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x + 0.5), (target.pos.y + 0.1), {size: 0.4, color: 'gold'});
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x), (target.pos.y - 0.4), {size: 0.4, color: 'gold'});
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x), (target.pos.y + 0.6), {size: 0.4, color: 'gold'});
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



