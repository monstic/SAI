var creepType = function(creep) {

    //DEFINE ACTIONS
    if (creep.memory.action === 'undefined') {
        creep.memory.action = 'claiming';
        creep.say('travel');
        cleanTarget(creep);
    }
    if (creep.room.targetType === 'travel' && creep.room.name === creep.memory.goto) {
        cleanTarget(creep);
    }
    if (creep.room.targetType === 'claim' && creep.room.name !== creep.memory.goto) {
        cleanTarget(creep);
    }

};

module.exports = creepType;

