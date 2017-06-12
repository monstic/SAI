var creepActFunctions = function(creep) {

    //SET TARGET
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {
        var flag = Game.flags.claim;
        if (creep.room.name !== flag.pos.roomName) {
            moveToByPath(creep, flag);
        }
        else {
            var controller = flag.pos.findClosestByRange(FIND_STRUCTURES, { filter: s => (s.structureType === STRUCTURE_CONTROLLER) });
            if (controller) {
                setTarget(creep, controller.id, 'CONTROLLER', controller.pos.roomName);
            }
        }
    }

    //CLAIM CONTROLLER
    if (creep.memory.targetId) {
        if (creep.memory.targetType === 'CONTROLLER') {
            target = Game.getObjectById(creep.memory.targetId);
            if (creep.room.name !== creep.memory.targetRoom) {
                var flag = Game.flags.claim;
                creep.moveTo(target);
            }
            else {
                console.log(creep.claimController(target));
                if(creep.claimController(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }


};


module.exports = creepActFunctions;
