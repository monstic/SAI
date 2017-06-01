var creepType = function(creep) {

    if (creep.memory.goto) {
        var flag = Game.flags.claim;
        if (creep.memory.goto !== creep.room.name) {
            moveToByPath(creep, flag.pos);
            console.log(flag.pos);
        }
    }




};

module.exports = creepType;

