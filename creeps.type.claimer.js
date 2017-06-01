var creepType = function(creep) {

    if (creep.memory.goto) {
        var flag = Game.flags.claim;
        if (creep.memory.goto !== creep.room.name) {
            moveToByPath(creep, flag.pos);
        }
        else {
            console.log(creep.room.controller.pos);
            if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                moveToByPath(creep, creep.room.controller.pos);
            }
        }
    }




};

module.exports = creepType;

