var creepType = function(creep) {

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
      creep.memory.action = 'healing';
      cleanTarget(creep);
      creep.say('🚑');
  }
  if (creep.memory.action === 'harvesting' && creep.carry.energy === creep.carryCapacity) {
      creep.memory.action = 'healing';
      creep.say('🚑');
      cleanSource(creep);
  }

};

module.exports = creepType;
