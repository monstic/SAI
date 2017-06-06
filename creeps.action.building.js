var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {

        //building
        if (creep.memory.action === 'building') {
            var findConstructionSiteToBuild = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (findConstructionSiteToBuild) {
                setTarget(creep, findConstructionSiteToBuild.id, 'CTST', findConstructionSiteToBuild.room.name);
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
                    if (target.pos.roomName !== creep.room.name) {
                        creep.moveTo(target);
                    }
                    else {
                        if (creep.build(target) === ERR_NOT_IN_RANGE) {
                            //VISUALS
                            new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'blue', lineStyle: 'dotted', opacity: 0.2});
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
                            new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'blue', lineStyle: 'dotted', opacity: 0.3});
                        }
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
