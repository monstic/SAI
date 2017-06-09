var creepTypeFunctions = function(creep) {

    if (creep.carry.energy === 0 && creep.memory.action !== 'recharging' && creep.memory.action !== 'harvesting') {
        creep.memory.action = 'recharging';
        cleanTarget(creep);
        creep.say('⛽');
    }
    if (creep.memory.action === 'undefined') {
        creep.memory.action = 'recharging';
        creep.say('⛽');
        cleanTarget(creep);
    }
    if ((creep.memory.action === 'recharging' || creep.memory.action === 'harvesting') && creep.carry.energy === creep.carryCapacity) {
        creep.memory.action = 'building';
        cleanTarget(creep);
        creep.say('🛠');
    }
    if (creep.memory.action === 'harvesting' && creep.carry.energy === creep.carryCapacity) {
        creep.memory.action = 'building';
        creep.say('🛠');
        cleanSource(creep);
    }

    //LOAD MODULES
    checkHostilesInRange(creep);

};

module.exports = creepTypeFunctions;
