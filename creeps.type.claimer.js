var creepType = function(creep) {

    if (creep.memory.goto) {
        var flag = Game.flags.claim;
        moveToByPath(creep, flag.pos);
    }




};

module.exports = creepType;

