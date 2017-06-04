var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {

        //upgrading
        if (creep.memory.action === 'upgrading') {
            if (creep.room.controller) {
                setTarget(creep, creep.room.controller.id, 'RMCT', creep.room.name);
            }
        }

    }


    if (creep.memory.targetId) {

        if (creep.memory.action === 'upgrading') {
            if (creep.memory.targetType === 'RMCT') {
                targetController = Game.getObjectById(creep.memory.targetId);
                //VISUALS
                new RoomVisual(creep.room.name).circle((targetController.pos.x), (targetController.pos.y - 0.02), {radius: 0.4, fill: 'red', lineStyle: 'dotted', opacity: 0.3});
                if (creep.upgradeController(targetController) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
                else if (creep.upgradeController(targetController) === ERR_BUSY) {
                    creep.say('!');
                }
                else if (creep.upgradeController(targetController) === ERR_FULL) {
                    creep.say('!!');
                }
                else if (creep.upgradeController(targetController) === ERR_TIRED) {
                    creep.say('!!!');
                }
                else if (creep.upgradeController(targetController) === ERR_INVALID_TARGET) {
                    cleanTarget(creep);
                    creep.say('?');
                }
            }
        }

    }

};



module.exports = creepActFunctions;

