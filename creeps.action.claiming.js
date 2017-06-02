var creepActFunctions = function(creep) {

    //SET TARGET
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {
        if (creep.room.name !== creep.memory.goto) {
            var flag = Game.flags.claim;
            setTarget(creep, flag.id, 'FLAG', flag.pos.roomName);
        }
        else {
            setTarget(creep, flag.id, 'CONTROLLER', creep.pos.roomName);
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
                    console.log(creep.claimController(creep.room.controller));
                    creep.moveTo(creep.room.controller);
                }
                else {
                    console.log(creep.claimController(creep.room.controller));
                }
            }
            else {
                cleanTarget(creep);
            }
        }
    }


};


module.exports = creepActFunctions;

