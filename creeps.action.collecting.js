var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {

        if (creep.carry.energy < creep.carryCapacity) {
            //collecting
            var droppedSources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            if (droppedSources) {
                setTarget(creep, droppedSources.id, 'DROP', droppedSources.room.name);
            }
        }
    }

    if (creep.memory.targetId) {

        if (creep.memory.targetType === 'DROP') {
            targetId = creep.memory.targetId;
            dropToGet = Game.getObjectById(targetId);
            if (dropToGet) {
                if (dropToGet.energy > 0 && dropToGet.energy !== null) {
                    //VISUALS
                    new RoomVisual(creep.room.name).text('get', (dropToGet.pos.x + 0.1), (dropToGet.pos.y - 0.5), {opacity: 0.5, size: 0.5, color: 'green'});
                    if (creep.pickup(dropToGet) === ERR_NOT_IN_RANGE) {
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
            else {
                cleanTarget(creep);
            }
        }
    }

};



module.exports = creepActFunctions;

