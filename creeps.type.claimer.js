var creepType = function(creep) {

    //DEFINE ACTIONS
    if (creep.memory.action === 'undefined') {
        creep.memory.action = 'claiming';
        creep.say('travel');
        cleanTarget(creep);
    }

};

module.exports = creepType;

