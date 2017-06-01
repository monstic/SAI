var creepTypeFunctions = function(creep) {

    //DEFINE ACTIONS
    if (creep.carry.energy === 0 && creep.memory.action !== 'harvesting') {
        creep.memory.action = 'harvesting';
        creep.say('hrvst');
        cleanTarget(creep);
    }
    if (creep.memory.action === 'undefined') {
        creep.memory.action = 'harvesting';
        creep.say('hrvst');
        cleanTarget(creep);
    }
    if (creep.memory.action === 'harvesting' && creep.carry.energy === creep.carryCapacity) {
        var totalTransporters = countCreeps('transporter', creep.room.name);
        if (totalTransporters > 0) {
            creep.memory.action = 'dropping';
            creep.say('drop');
            cleanTarget(creep);
        }
        else {
            creep.memory.action = 'filling';
            creep.say('fill');
            cleanTarget(creep);
        }
    }

    if (creep.carry[RESOURCE_GHODIUM_OXIDE] > 0) {
        creep.drop(RESOURCE_GHODIUM_OXIDE);
        creep.say('drop GO');
    }

};

module.exports = creepTypeFunctions;

