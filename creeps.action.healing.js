var creepActFunctions = function(creep) {

    //HEAL FRIENDS
    var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (w) => w.hits < w.hitsMax });
    if (target) {
        if (creep.heal(target) === ERR_NOT_IN_RANGE) {
            //VISUALS
            new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'green', lineStyle: 'dotted', opacity: 0.1});
            creep.moveTo(target);
        }
        else if (creep.heal(target) === ERR_TIRED) {
            creep.say('!!!');
        }
        else if (creep.heal(target) === ERR_INVALID_TARGET) {
            creep.say('?');
            cleanTarget(creep);
        }
        else {
            //VISUALS
            new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'green', lineStyle: 'dotted', opacity: 0.3});
        }
    }
    else {
        //GO TO GUARDS
        var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (w) => w.hits < w.hitsMax && w.getActiveBodyparts(ATTACK) > 0});
        if (target) {
            if (creep.pos !== target.pos) {
              creep.moveTo(target);
            }
        }
        else {
            var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (w) => w.getActiveBodyparts(ATTACK) > 0});
            if (target) {
                if (creep.pos !== target.pos) {
                  creep.moveTo(target);
                }
            }
        }
    }

};


module.exports = creepActFunctions;
