var creepType = function(creep) {

    //DEFINE ACTIONS
    if (Game.flags.claim && creep.memory.action === 'undefined') {
        creep.memory.action = 'claiming';
        cleanTarget(creep);
    }
    if (!Game.flags.claim && creep.memory.action === 'claiming') {
        creep.memory.action = 'undefined';
        cleanTarget(creep);
    }
    if (creep.memory.action !== 'defending' && Memory.rooms[creep.room.name].security.underattack === 'yes') {
        creep.memory.action = 'defending';
        cleanTarget(creep);
        creep.say('🔫');
    }

    if (creep.memory.action === 'defending' && Memory.rooms[creep.room.name].security.underattack !== 'yes') {
        creep.memory.action = 'claiming';
        cleanTarget(creep);
    }


};

module.exports = creepType;
