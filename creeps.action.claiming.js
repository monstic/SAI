var creepActFunctions = function(creep) {

    //SET TARGET
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {
        if (creep.room.name !== creep.memory.goto) {
            var flag = Game.flags.claim;
            setTarget(creep, 'travel', 'FLAG', flag.pos.roomName);
        }
        else {
            setTarget(creep, 'claim', 'CONTROLLER', creep.pos.roomName);
        }
    }

    if (creep.room.targetId === 'travel' && creep.room.name === creep.memory.goto) {
        cleanTarget(creep);
    }
    if (creep.room.targetId === 'claim' && creep.room.name !== creep.memory.goto) {
        cleanTarget(creep);
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
                console.log(creep.claimController(creep.room.controller));
                creep.moveTo(creep.room.controller);
            }
            else {
                console.log(creep.claimController(creep.room.controller));
            }
        }
    }


};


module.exports = creepActFunctions;

