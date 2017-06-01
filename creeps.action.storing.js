var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {

        //storing
        if (creep.memory.action === 'storing') {
            if (Memory.rooms[creep.room.name].structure.storage.mineral) {
                /** @type {StructureContainer} */
                let container;
                container = Game.getObjectById(Memory.rooms[creep.room.name].structure.storage.mineral);
                if (container !== 'undefined' && container) {
                    setTarget(creep, container.id, 'LOWSTO', creep.room.name);
                    
                }
            }
        }
        
    }

    if (creep.memory.targetId) {
        if (creep.memory.targetType === 'LOWSTO') {
            target = Game.getObjectById(creep.memory.targetId);
            if (target) {
                //VISUALS
                new RoomVisual(creep.room.name).text('store', (target.pos.x), (target.pos.y));
                if (Memory.rooms[creep.room.name].mineral.mineralType === 'H') {
                    if (creep.transfer(target, RESOURCE_HYDROGEN) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else if (Memory.rooms[creep.room.name].mineral.mineralType === 'O') {
                    if (creep.transfer(target, RESOURCE_OXYGEN) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else if (Memory.rooms[creep.room.name].mineral.mineralType === 'U') {
                    if (creep.transfer(target, RESOURCE_UTRIUM) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else if (Memory.rooms[creep.room.name].mineral.mineralType === 'K') {
                    if (creep.transfer(target, RESOURCE_KEANIUM) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else if (Memory.rooms[creep.room.name].mineral.mineralType === 'L') {
                    if (creep.transfer(target, RESOURCE_LEMERGIUM) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else if (Memory.rooms[creep.room.name].mineral.mineralType === 'Z') {
                    if (creep.transfer(target, RESOURCE_ZYNTHIUM) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else if (Memory.rooms[creep.room.name].mineral.mineralType === 'X') {
                    if (creep.transfer(target, RESOURCE_CATALYST) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else {
                    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }

        }
    }

};



module.exports = creepActFunctions;

