var creepTypeFunctions = function(creep) {

    //DEFINE ACTIONS
    if (creep.carry.energy === 0 && creep.memory.action !== 'collecting') {
        creep.memory.action = 'collecting';
        creep.say('collect');
        cleanTarget(creep);
    }
    if (creep.memory.action === 'undefined') {
        creep.memory.action = 'collecting';
        creep.say('collect');
        cleanTarget(creep);
    }
    if (creep.memory.action === 'collecting' && creep.carry.energy === creep.carryCapacity) {
        creep.memory.action = 'filling';
        creep.say('fill');
        cleanTarget(creep);
    }



};

module.exports = creepTypeFunctions;


