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
            target = Game.getObjectById(targetId);
            if (target) {
                if (target.energy > 0 && target.energy !== null) {
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
            else {
                cleanTarget(creep);
            }
        }
    }

};



module.exports = creepActFunctions;

