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
                setTarget(creep, controller.id, 'CONTROLLER', flag.pos.roomName);
            }
        }
    }

    //CLAIM CONTROLLER
    if (creep.memory.targetId) {
        if (creep.memory.targetType === 'CONTROLLER') {
            if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }


};


module.exports = creepActFunctions;
