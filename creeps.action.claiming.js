var creepActFunctions = function(creep) {

    //SET TARGET
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {
        var flag = Game.flags.claim;
        if (creep.room.name !== creep.memory.goto) {
            var controller = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: s => (s.structureType === STRUCTURE_CONTROLLER) });
            setTarget(creep, controller.id, 'FLAG', flag.pos.roomName);
            Memory.rooms[flag.pos.roomName].info.claim = "no";
        }
        else {
            var controller = flag.pos.findClosestByRange(FIND_STRUCTURES, { filter: s => (s.structureType === STRUCTURE_CONTROLLER) });
            if (controller) {
                setTarget(creep, controller.id, 'CONTROLLER', flag.pos.roomName);
            }
            Memory.rooms[flag.pos.roomName].info.claim = "claiming";
        }
    }

    //CLAIM CONTROLLER
    if (creep.memory.targetId) {
        if (creep.memory.targetType === 'FLAG') {
            var target = Game.flags.claim;
            if (target.pos.roomName !== creep.room.name) {
                moveToByPath(creep, target.pos);
            }
            else {
                cleanTarget(creep);
            }
        }
        if (creep.memory.targetType === 'CONTROLLER') {
            if (creep.memory.goto === creep.room.name) {
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
            else {
                cleanTarget(creep);
            }
        }
    }


};


module.exports = creepActFunctions;

