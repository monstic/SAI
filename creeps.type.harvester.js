var creepTypeFunctions = function(creep) {

    log('debug');

    //DEFINE ACTIONS
    if (creep.carry.energy === 0 && creep.memory.action !== 'harvesting') {
        creep.memory.action = 'harvesting';
        creep.say('🔌');
    }
    if (creep.memory.action === 'undefined') {
        creep.memory.action = 'harvesting';
        creep.say('🔌');
        cleanTarget(creep);
    }
    if (creep.memory.action === 'harvesting' && creep.carry.energy === creep.carryCapacity) {
        var totalTransporters = countCreeps('transporter', creep.room.name);
        if (totalTransporters > 0) {
            var container = creep.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => (s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity)});
            if (container[0]) {
                creep.memory.action = 'fillcontainer';
                setTarget(creep, container[0].id, 'LOWCT', creep.room.name);
                creep.say('🚨');
            }
            else {
                creep.memory.action = 'dropping';
                creep.say('🚨');
            }
        }
        else {
            if (Game.rooms[creep.memory.homeroom].energyAvailable < Game.rooms[creep.memory.homeroom].energyCapacityAvailable) {
                creep.memory.action = 'filling';
                creep.say('🚛');
                cleanTarget(creep);
            }
            else {
              creep.memory.action = 'dropping';
              creep.say('🚨');
            }
        }
    }

    if (creep.carry[RESOURCE_GHODIUM_OXIDE] > 0) {
        creep.drop(RESOURCE_GHODIUM_OXIDE);
        creep.say('🚨🚨');
    }

};

module.exports = creepTypeFunctions;
