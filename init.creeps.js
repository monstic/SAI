module.exports = function (creep) {

    //LOAD MODULES
    //saveTrail(creep);

    //GO TO TARGET ROOM
    if (creep.memory.targetId) {
        if (creep.room.name !== creep.memory.targetRoom) {
            var target = Game.getObjectById(creep.memory.targetId);
            if (target) {
                moveToByPath(creep, target);
            }
        }
    }
    if (creep.memory.sourceId) {
        if (creep.room.name !== creep.memory.sourceRoom) {
            var source = Game.getObjectById(creep.memory.sourceId);
            if (source) {
                moveToByPath(creep, source);
            }
        }
    }

};
