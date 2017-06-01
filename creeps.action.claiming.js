var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (creep.memory.goto) {
        var flag = Game.flags.claim;
        if (creep.memory.goto !== creep.room.name) {
            moveToByPath(creep, flag.pos);
        }
        else {
            if(creep.room.controller) {
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                   moveToByPath(creep, creep.room.controller.pos);
                }
            }
        }
    }



};


module.exports = creepActFunctions;

