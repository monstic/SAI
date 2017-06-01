var creepTypeFunctions = function(creep) {

    if (creep.carry.energy === 0 && creep.memory.action !== 'recharging' && creep.memory.action !== 'harvesting') {
        creep.memory.action = 'recharging';
        cleanTarget(creep);
        creep.say('fuel');
    }
    if (creep.memory.action === 'undefined') {
        creep.memory.action = 'recharging';
        creep.say('fuel');
        cleanTarget(creep);
    }
    if ((creep.memory.action === 'recharging' || creep.memory.action === 'harvesting') && creep.carry.energy === creep.carryCapacity) {
        creep.memory.action = 'building';
        cleanTarget(creep);
        creep.say('b or r');
    }
};

module.exports = creepTypeFunctions;

