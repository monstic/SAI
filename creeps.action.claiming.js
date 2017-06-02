var creepActFunctions = function(creep) {

    //SET TARGET
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {
        if (creep.room.name !== creep.memory.goto) {
            cleanTarget(creep);
            var flag = Game.flags.claim;
            setTarget(creep, 'travel', 'FLAG', flag.pos.roomName);
        }
        else {
            cleanTarget(creep);
            setTarget(creep, 'claim', 'CONTROLLER', creep.pos.roomName);
        }
    }

       

    //CLAIM CONTROLLER
    if (creep.memory.targetId) {
        if (creep.memory.targetType === 'FLAG') {
            var target = Game.flags.claim;
            if (target.pos.roomName !== creep.room.name) {
                moveToByPath(creep, target.pos);
            }
        }
        if (creep.memory.targetType === 'CONTROLLER') {
            if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }


};


module.exports = creepActFunctions;

