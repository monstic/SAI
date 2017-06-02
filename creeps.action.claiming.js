var creepActFunctions = function(creep) {

    //SET TARGET
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {
        cleanTarget(creep);
        var flag = Game.flags.claim;
        setTarget(creep, 'claim', 'CONTROLLER', flag.pos.roomName);
    }

    //CLAIM CONTROLLER
    if (creep.memory.targetId) {
        var target = Game.flags.claim;
        if (target.pos.roomName !== creep.room.name) {
            moveToByPath(creep, target.pos);
        }
        else {
            if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                moveToByPath(creep, target.pos);
            }
        }
    }


};


module.exports = creepActFunctions;

