var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {

        //building
        if (creep.memory.action === 'building') {
            var findConstructionSiteToBuild = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (findConstructionSiteToBuild) {
                creep.memory.targetId = findConstructionSiteToBuild.id;
                creep.memory.targetType = 'CTST';
                creep.memory.targetRoom = findConstructionSiteToBuild.room.name;
            }
            else {
                creep.memory.action = 'repairing';
                cleanTarget(creep);
            }
        }

    }

    if (creep.memory.targetId) {

        if (creep.memory.action === 'building') {

            if (creep.memory.targetType === 'CTST') {
                var target = Game.getObjectById(creep.memory.targetId);
                if (target) {
                    //VISUALS
                    new RoomVisual(creep.room.name).text('b', (target.pos.x), (target.pos.y + 0.2));

                    if (creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    else if (creep.build(target) === ERR_BUSY) {
                        creep.say('!');
                    }
                    else if (creep.build(target) === ERR_FULL) {
                        creep.say('!!');
                    }
                    else if (creep.build(target) === ERR_TIRED) {
                        creep.say('!!!');
                    }
                    else if (creep.build(target) === ERR_INVALID_TARGET) {
                        creep.say('?');
                        cleanTarget(creep);
                    }
                    else {
                        //VISUALS
                        new RoomVisual(creep.room.name).text('.', (target.pos.x - 0.5), (target.pos.y + 0.1), {size: 0.4, color: 'gold'});
                        new RoomVisual(creep.room.name).text('.', (target.pos.x + 0.5), (target.pos.y + 0.1), {size: 0.4, color: 'gold'});
                        new RoomVisual(creep.room.name).text('.', (target.pos.x), (target.pos.y - 0.4), {size: 0.4, color: 'gold'});
                        new RoomVisual(creep.room.name).text('.', (target.pos.x), (target.pos.y + 0.6), {size: 0.4, color: 'gold'});
                    }
                }
                else {
                    cleanTarget(creep);
                }
            }

        }
    }


};


module.exports = creepActFunctions;

