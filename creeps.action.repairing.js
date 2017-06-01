var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {

        //repairing
        if (creep.memory.action === 'repairing') {
            var repairs = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.hits < 1000 && s.structureType !== STRUCTURE_ROAD)});
            if (repairs.length > 0) {
                creep.memory.targetId = repairs[0].id;
                creep.memory.targetType = 'STDMG';
                creep.memory.targetRoom = creep.room.name;
            }
            else {
                var repairs = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.hits < 5000 && s.structureType !== STRUCTURE_ROAD)});
                if (repairs.length > 0) {
                    creep.memory.targetId = repairs[0].id;
                    creep.memory.targetType = 'STDMG';
                    creep.memory.targetRoom = creep.room.name;
                }
                else {
                    var repairs = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.hits < 10000 && s.structureType !== STRUCTURE_ROAD)});
                    if (repairs.length > 0) {
                        creep.memory.targetId = repairs[0].id;
                        creep.memory.targetType = 'STDMG';
                        creep.memory.targetRoom = creep.room.name;
                    }
                    else {
                        var repairs = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.hits < 100000 && s.structureType !== STRUCTURE_ROAD)});
                        if (repairs.length > 0) {
                            creep.memory.targetId = repairs[0].id;
                            creep.memory.targetType = 'STDMG';
                            creep.memory.targetRoom = creep.room.name;
                        }
                        else {
                            var repairs = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.hits < s.hitsMax && s.structureType !== STRUCTURE_ROAD)});
                            if (repairs.length > 0) {
                                creep.memory.targetId = repairs[0].id;
                                creep.memory.targetType = 'STDMG';
                                creep.memory.targetRoom = creep.room.name;
                            }
                            else {
                                creep.memory.action = 'building';
                                cleanTarget(creep);
                            }
                        }
                    }
                }
            }
        }
    }

    if (creep.memory.targetId) {

        if (creep.memory.action === 'repairing') {
            if (creep.memory.targetType === 'STDMG') {
                var target = Game.getObjectById(creep.memory.targetId);
                if (target) {
                    if (target.hits < target.hitsMax) {
                        //VISUALS
                        new RoomVisual(creep.room.name).text('R', (target.pos.x), (target.pos.y + 0.2));

                        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                        else if (creep.repair(target) === ERR_BUSY) {
                            creep.say('!');
                        }
                        else if (creep.repair(target) === ERR_FULL) {
                            creep.say('!!');
                        }
                        else if (creep.repair(target) === ERR_TIRED) {
                            creep.say('!!!');
                        }
                        else if (creep.repair(target) === ERR_INVALID_TARGET) {
                            cleanTarget(creep);
                            creep.say('?');
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
