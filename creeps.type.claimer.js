var creepType = function(creep) {

    //DEFINE ACTIONS
    if (Game.flags.claim && creep.memory.action === 'undefined') {
        creep.memory.action = 'claiming';
        cleanTarget(creep);
    }
    if (!Game.flags.claim && creep.memory.action === 'claiming') {
        creep.memory.action = 'undefined';
        cleanTarget(creep);
    }


};

module.exports = creepType;
