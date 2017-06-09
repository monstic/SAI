var creepActFunctions = function(creep) {

    if (creep.carry[RESOURCE_GHODIUM_OXIDE] > 0) {
        if (Memory.rooms[room.name].structure.container.controller) {
            creep.memory.action = 'storing';
        }
    }

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {
        creep.memory.action = 'undefined';
    }

    if (creep.memory.targetId) {

        if (creep.memory.targetType === 'LOWCT') {
            target = Game.getObjectById(creep.memory.targetId);
            if (target) {
                if ((_.sum(target.store) < 2000)) {

                    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        //VISUALS
                        new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'gold', lineStyle: 'dotted', opacity: 0.2});
                        new RoomVisual(creep.room.name).text('⚡', (target.pos.x - 0.01), (target.pos.y + 0.20), {opacity: 0.5, size: 0.5});
                        creep.moveTo(target);
                    }
                    else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_BUSY) {
                        cleanTarget(creep);
                        creep.say('!');
                    }
                    else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_FULL) {
                        cleanTarget(creep);
                        creep.say('!!');
                    }
                    else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_TIRED) {
                        cleanTarget(creep);
                        creep.say('!!!');
                    }
                    else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_INVALID_TARGET) {
                        cleanTarget(creep);
                        creep.say('?');
                    }
                    else {
                        //VISUALS
                        new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'gold', lineStyle: 'dotted', opacity: 0.3});
                        new RoomVisual(creep.room.name).text('⚡', (target.pos.x - 0.01), (target.pos.y + 0.20), {opacity: 0.5, size: 0.5});
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

};



module.exports = creepActFunctions;
