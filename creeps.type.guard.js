var creepType = function(creep) {

  if (creep.memory.action === 'patroling' && (Memory.rooms[creep.room.name].security.underattack === 'yes' || Memory.hostiles.targetId)) {
      creep.memory.action = 'defending';
      cleanTarget(creep);
      creep.say('🔫');
  }

  if (creep.memory.action === 'defending' && Memory.rooms[creep.room.name].security.underattack !== 'yes' && (!Memory.hostiles.targetId || Memory.hostiles.targetId === 'undefined')) {
      creep.memory.action = 'patroling';
      cleanTarget(creep);
      creep.say('👮');
  }

  if (creep.memory.action === 'undefined') {
      creep.memory.action = 'patroling';
      cleanTarget(creep);
      creep.say('👮');
  }

};

module.exports = creepType;
