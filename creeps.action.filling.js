var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.targetId || creep.memory.targetId === 'undefined') {

        if (Memory.rooms[creep.room.name]) {

            //FILL SPAWN
            if (Memory.rooms[creep.room.name].spawns[creep.memory.homespawn]) {
                var target = Game.getObjectById(Memory.rooms[creep.room.name].spawns[creep.memory.homespawn].id);
                if (target.energy < target.energyCapacity) {
                    setTarget(creep, target.id, 'LOWSP', target.room.name);
                }
                else {

                    //FILL TOWERS IF IS UNDER ATTACK
                    if (Memory.rooms[creep.room.name].security.underattack === 'yes') {
                        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => { return ( ((structure.structureType === STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity)))}});
                        if (target) {
                             setTarget(creep, target.id, 'LOWTW', creep.room.name);
                        }
                    }
                    else {

                        //FILL EXTENSIONS
                        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity)});
                        if (target) {
                            setTarget(creep, target.id, 'LOWST', target.room.name);
                        }
                        else {

                            //FILL TOWERS WITH NO ENERGY
                            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => { return ( ((structure.structureType === STRUCTURE_TOWER) && (structure.energy === 0)))}});
                            if (target) {
                                setTarget(creep, target.id, 'LOWTW', target.room.name);
                            }
                            else {

                                //FILL TOWERS IS NOT FULL
                                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => { return ( ((structure.structureType === STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity)))}});
                                if (target) {
                                    setTarget(creep, target.id, 'LOWTW', target.room.name);
                                }
                                else {

                                    //FILL CONTROLLER CONTAINER IF EXIST
                                    if (Memory.rooms[creep.room.name].structure) {
                                        if (Memory.rooms[creep.room.name].structure.container) {
                                            var containerC = Game.getObjectById(Memory.rooms[creep.room.name].structure.container.controller);
                                            if (!containerC) {
                                                  var containerC = 'no'
                                            }
                                        }
                                        else {
                                            var containerC = 'no'
                                        }
                                    }
                                    else {
                                        var containerC = 'no'
                                    }
                                    // if one was found
                                    if (containerC !== 'no') {
                                        if (containerC.store[RESOURCE_ENERGY] < containerC.storeCapacity) {
                                            setTarget(creep, Memory.rooms[creep.room.name].structure.container.controller, 'LOWCT', creep.room.name);
                                        }
                                    }
                                    else {

                                        //FILL SOURCE 0 CONTAINER IF EXIST
                                        if (Memory.rooms[creep.room.name].structure) {
                                            if (Memory.rooms[creep.room.name].structure.container) {
                                                if (Memory.rooms[creep.room.name].structure.container.source) {
                                                    var containerS = Game.getObjectById(Memory.rooms[creep.room.name].structure.container.source);
                                                    if (!containerS) {
                                                          var containerS = 'no'
                                                    }
                                                }
                                                else {
                                                    var containerS = 'no'
                                                }
                                            }
                                            else {
                                                var containerS = 'no'
                                            }
                                        }
                                        else {
                                            var containerS = 'no'
                                        }
                                        // if one was found
                                        if (containerS !== 'no') {
                                            if (containerS.store[RESOURCE_ENERGY] < containerS.storeCapacity) {
                                                setTarget(creep, Memory.rooms[creep.room.name].structure.container.source, 'LOWCT', creep.room.name);
                                            }
                                        }
                                        else {

                                            //FILL SOURCE 1 CONTAINER IF EXIST
                                            if (Memory.rooms[creep.room.name].structure) {
                                                if (Memory.rooms[creep.room.name].structure.container) {
                                                    if (Memory.rooms[creep.room.name].structure.container.source1) {
                                                        var containerSS = Game.getObjectById(Memory.rooms[creep.room.name].structure.container.source1);
                                                        if (!containerSS) {
                                                              var containerSS = 'no'
                                                        }
                                                    }
                                                    else {
                                                        var containerSS = 'no'
                                                    }
                                                }
                                                else {
                                                    var containerSS = 'no'
                                                }
                                            }
                                            else {
                                                var containerSS = 'no'
                                            }
                                            // if one was found
                                            if (containerSS !== 'no') {
                                                if ((_.sum(containerSS.store) < 1000000)) {
                                                    setTarget(creep, target.id, 'LOWSTO', target.room.name);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    if (creep.memory.targetId) {

        if (creep.memory.targetType === 'LOWST' || creep.memory.targetType === 'LOWSP' || creep.memory.targetType === 'LOWTW') {
            target = Game.getObjectById(creep.memory.targetId);
            if (target.pos.roomName !== creep.room.name) {
                moveToByPath(creep, target);
            }
            else {
                if (target && target.energy !== null) {
                    if (target.energy < target.energyCapacity) {
                        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            //VISUALS
                            new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'gold', lineStyle: 'dotted', opacity: 0.2});
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x - 0.01), (target.pos.y + 0.20), {opacity: 0.5, size: 0.5});
                            creep.moveTo(target);
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_BUSY) {
                            cleanTarget(creep);
                            creep.say('!');
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_FULL) {
                            cleanTarget(creep);
                            creep.say('!!');
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_TIRED) {
                            cleanTarget(creep);
                            creep.say('!!!');
                        }
                        else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_INVALID_TARGET) {
                            cleanTarget(creep);
                            creep.say('?');
                        }
                        else {
                            //VISUALS
                            new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'gold', lineStyle: 'dotted', opacity: 0.3});
                            new RoomVisual(creep.room.name).text('⚡', (target.pos.x - 0.01), (target.pos.y + 0.20), {opacity: 0.5, size: 0.5});
                        }
                    }
                    else {
                        cleanTarget(creep);
                    }
                }
            }
        }

        if (creep.memory.targetType === 'LOWCT') {
            target = Game.getObjectById(creep.memory.targetId);
            if (target.pos.roomName !== creep.room.name) {
                creep.moveTo(target);
            }
            else {
                if ((_.sum(target.store) < 2000)) {

                    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        //VISUALS
                        new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'gold', lineStyle: 'dotted', opacity: 0.2});
                        new RoomVisual(creep.room.name).text('⚡', (target.pos.x - 0.01), (target.pos.y + 0.20), {opacity: 0.5, size: 0.5});
                        creep.moveTo(target);
                    }
                    else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_BUSY) {
                        cleanTarget(creep);
                        creep.say('!');
                    }
                    else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_FULL) {
                        cleanTarget(creep);
                        creep.say('!!');
                    }
                    else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_TIRED) {
                        cleanTarget(creep);
                        creep.say('!!!');
                    }
                    else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_INVALID_TARGET) {
                        cleanTarget(creep);
                        creep.say('?');
                    }
                    else {
                        //VISUALS
                        new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.4, fill: 'gold', lineStyle: 'dotted', opacity: 0.3});
                        new RoomVisual(creep.room.name).text('⚡', (target.pos.x - 0.01), (target.pos.y + 0.20), {opacity: 0.5, size: 0.5});
                    }
                }
                else {
                    cleanTarget(creep);
                }
            }
        }

        if (creep.memory.targetType === 'LOWSTO') {
            target = Game.getObjectById(creep.memory.targetId);
            if (target.pos.roomName !== creep.room.name) {
                creep.moveTo(target);
            }
            else {
                if ((_.sum(target.store) < 1000000)) {
                    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        //VISUALS
                        new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.7, fill: 'gold', lineStyle: 'dotted', opacity: 0.2});
                        new RoomVisual(creep.room.name).text('⚡', (target.pos.x - 0.01), (target.pos.y + 0.20), {opacity: 0.5, size: 0.5});
                        creep.moveTo(target);
                    }
                    else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_BUSY) {
                        creep.say('!');
                    }
                    else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_FULL) {
                        creep.say('!!');
                    }
                    else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_TIRED) {
                        creep.say('!!!');
                    }
                    else if (creep.transfer(target, RESOURCE_ENERGY) === ERR_INVALID_TARGET) {
                        cleanTarget(creep);
                        creep.say('?');
                    }
                    else {
                        //VISUALS
                        new RoomVisual(creep.room.name).circle((target.pos.x), (target.pos.y), {radius: 0.7, fill: 'gold', lineStyle: 'dotted', opacity: 0.2});
                        new RoomVisual(creep.room.name).text('⚡', (target.pos.x - 0.01), (target.pos.y + 0.20), {opacity: 0.5, size: 0.5});
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
