var creepType = function(creep) {

    //DEFINE ACTIONS
    if (creep.memory.action === 'undefined') {
        creep.memory.action = 'claiming';
        creep.say('claim');
        cleanTarget(creep);
    }


};

module.exports = creepType;

