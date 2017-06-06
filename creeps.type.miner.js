var creepTypeFunctions = function(creep) {

    var total =(_.sum(creep.carry));

    //DEFINE ACTIONS

    if (total === 0 && creep.memory.action !== 'mining') {
        creep.memory.action = 'mining';
        creep.say('⛏');
        cleanTarget(creep);
    }
    if (creep.memory.action === 'undefined') {
        creep.memory.action = 'mining';
        creep.say('⛏');
        cleanTarget(creep);
    }
    if (creep.memory.action === 'mining' && total === creep.carryCapacity) {
        creep.memory.action = 'storing';
        creep.say('🚛');
        cleanTarget(creep);
    }


};


module.exports = creepTypeFunctions;
