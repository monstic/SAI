var creepTypeFunctions = function(creep) {

    //DEFINE ACTIONS
    if (creep.carry.energy === 0 && creep.memory.action !== 'harvesting') {
        creep.memory.action = 'harvesting';
        creep.say('⚡');
        cleanTarget(creep);
    }
    if (creep.memory.action === 'undefined') {
        creep.memory.action = 'harvesting';
        creep.say('⚡');
        cleanTarget(creep);
    }
    if (creep.memory.action === 'harvesting' && creep.carry.energy === creep.carryCapacity) {
        var totalTransporters = countCreeps('transporter', creep.room.name);
        if (totalTransporters > 0) {
            creep.memory.action = 'dropping';
            creep.say('🚨');
            cleanTarget(creep);
        }
        else {
            creep.memory.action = 'filling';
            creep.say('🚚');
            cleanTarget(creep);
        }
    }


};

module.exports = creepTypeFunctions;


