var creepType = function(creep) {

    //DEFINE ACTIONS
    if (!creep.carry.action || creep.memory.action === 'undefined') {
        creep.memory.action = 'claiming';
        creep.say('claim');
        cleanTarget(creep);
    }
    if (creep.memory.action === 'claiming') {
        if (creep.room.controller.my) {
        creep.memory.action = 'claimed';
        creep.say('claimed');
        cleanTarget(creep);
    }


};

module.exports = creepType;

