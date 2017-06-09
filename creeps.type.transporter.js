var creepTypeFunctions = function(creep) {

    //DEFINE ACTIONS
    if (creep.carry.energy === 0 && creep.memory.action !== 'collecting') {
        creep.memory.action = 'collecting';
        creep.say('🚚');
        cleanTarget(creep);
    }
    if (creep.memory.action === 'undefined') {
        creep.memory.action = 'collecting';
        creep.say('🚚');
        cleanTarget(creep);
    }
    if (creep.memory.action === 'collecting' && creep.carry.energy === creep.carryCapacity) {
        creep.memory.action = 'filling';
        creep.say('🚛');
        cleanTarget(creep);
    }
    if (creep.memory.action === 'harvesting' && creep.carry.energy === creep.carryCapacity) {
        creep.memory.action = 'filling';
        creep.say('🚛');
        cleanSource(creep);
    }

    //LOAD MODULES
    checkHostilesInRange(creep);


};


module.exports = creepTypeFunctions;
