var creepActFunctions = function(creep) {

    if (Memory.attack) {
        if (Memory.attack.targetid) {
            var target = Game.getObjectById(Memory.attack.targetid);
            if (creep.room.name === target.pos.roomName) {
                var war = 'yes';
            }
            else {
                var war = 'no';
            }
        }
        else {
            var war = 'yes';
        }
    }
    else {
        var war = 'yes';
    }


    if (war === 'yes') {
        //ATTACK HOSTILE HEALER
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: function (object) { return object.getActiveBodyparts(HEAL) > 0 } });
        if (target) {
            if (creep.room.name !== target.pos.roomName) {
              moveToByPath(creep, target);
            }
            else {
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    //VISUALS
                    new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'red', lineStyle: 'dotted', opacity: 0.1});
                    creep.moveTo(target);
                }
                else if (creep.attack(target) === ERR_TIRED) {
                    creep.say('!!!');
                }
                else if (creep.attack(target) === ERR_INVALID_TARGET) {
                    creep.say('?');
                    cleanTarget(creep);
                }
                else {
                    //VISUALS
                    new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'red', lineStyle: 'dotted', opacity: 0.3});
                }
            }
        }
        else {
            //ATTACK HOSTILE WITH ATTACK BODY
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: function (object) { return object.getActiveBodyparts(ATTACK) > 0 } });
            if (target) {
                if (creep.room.name !== target.pos.roomName) {
                  moveToByPath(creep, target);
                }
                else {
                    if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                        //VISUALS
                        new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'red', lineStyle: 'dotted', opacity: 0.1});
                        creep.moveTo(target);
                    }
                    else if (creep.attack(target) === ERR_TIRED) {
                        creep.say('!!!');
                    }
                    else if (creep.attack(target) === ERR_INVALID_TARGET) {
                        creep.say('?');
                        cleanTarget(creep);
                    }
                    else {
                        //VISUALS
                        new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'red', lineStyle: 'dotted', opacity: 0.3});
                    }
                }
            }
            else {
                //ATTACK ALL HOSTILES
                var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (target) {
                    if (creep.room.name !== target.pos.roomName) {
                      moveToByPath(creep, target);
                    }
                    else {
                        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                            //VISUALS
                            new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'red', lineStyle: 'dotted', opacity: 0.1});
                            creep.moveTo(target);
                        }
                        else if (creep.attack(target) === ERR_TIRED) {
                            creep.say('!!!');
                        }
                        else if (creep.attack(target) === ERR_INVALID_TARGET) {
                            creep.say('?');
                            cleanTarget(creep);
                        }
                        else {
                            //VISUALS
                            new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'red', lineStyle: 'dotted', opacity: 0.3});
                        }
                    }
                }
            }
        }
    }
};



module.exports = creepActFunctions;
