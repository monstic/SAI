var creepActFunctions = function(creep) {

    //SET TARGET
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {
        var flag = Game.flags.claim;
        setTarget(creep, 'claim', 'LOWSTO', flag.pos.roomName);
        delete creep.memory.path;
        creep.memory.path = creep.pos.findPathTo(flag);
    }

    //CLAIM CONTROLLER
    if (creep.memory.targetId) {
        var target = Game.flags.claim;
        if (target.pos.roomName !== creep.room.name) {
            moveToByPath(creep, target.pos);
        }
        else {
            if(creep.room.controller) {
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveByPath(creep.memory.path);
                }
            }
        }
    }


};


module.exports = creepActFunctions;

