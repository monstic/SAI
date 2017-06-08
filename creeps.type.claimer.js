var creepType = function(creep) {

    //DEFINE ACTIONS
    if (Game.flags.claim) {
      var flag = Game.flags.claim;
      var findController = flag.room.find(FIND_HOSTILE_CREEPS);
    }
    
    if (creep.memory.action === 'patroling' && (target.length > 0 || Memory.attack.targetid)) {
        creep.memory.action = 'defending';
        cleanTarget(creep);
        creep.say('🔫');
    }
    if (creep.memory.action === 'defending' && target.length === 0) {
      creep.memory.action = 'patroling';
      cleanTarget(creep);
    }
    if (creep.memory.action === 'undefined') {
        creep.memory.action = 'patroling';
        cleanTarget(creep);
        creep.say('👮');
    }


};

module.exports = creepType;
