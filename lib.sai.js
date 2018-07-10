//LIB SAI
log = console.log;

//COUNT CREEPS
countCreeps =
    function (type, roomname, livetime) {
        if (type === 'all') {
            if (livetime) {
                var total = (_.sum(Game.creeps, (c) => c.room.name === roomname && c.ticksToLive >= livetime));
            }
            else {
                var total = (_.sum(Game.creeps, (c) => c.room.name === roomname));
            }
            return total;
        }
        else {
            if (livetime) {
                var total = _.sum(Game.creeps, (c) => c.memory.type === type && c.memory.homeroom === roomname && c.ticksToLive >= livetime);
            }
            else {
                var total = _.sum(Game.creeps, (c) => c.memory.type === type && c.memory.homeroom === roomname);
            }
            return total;
        }
    };

//COUNT CREEPS IN SAME SOURCE
countCreepsInSource =
    function (source) {
        var creeps = Game.creeps;
        var i = 0;
        for (var creep in creeps) {
            if (creeps[creep].memory.sourceId === source) {
                i++;
            }
        }
        return i;
    };

//SET TARGET
setTarget =
    function (creep, targetid, type, roomname) {
        creep.memory.targetId = targetid;
        creep.memory.targetType = type;
        creep.memory.targetRoom = roomname;
        var target = Game.getObjectById(targetid);
        creep.memory.path = creep.pos.findPathTo(target);
        return 1;
    };

//CLEAN TARGET
cleanTarget =
    function (creep) {
        delete creep.memory.targetId;
        delete creep.memory.targetRoom;
        delete creep.memory.targetType;
        delete creep.memory.sourceId;
        delete creep.memory.sourceRoom;
        delete creep.memory.sourceType;
        delete creep.memory.path;
        return 1;
    };

//SIGN CONTROLLER
signController =
    function (creep) {
        if (creep.room.controller) {
            if (creep.room.controller.my) {
                if (!creep.room.controller.sign) {
                    var SignMessage = Memory.system.signmsg;
                    if (creep.signController(creep.room.controller, SignMessage) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
    };


//CREEP TYPES
spawnProtoCreep =
    function (spawnname, creeptype, creepgoto) {
        var spawn = Game.spawns[spawnname];
        var room = Game.rooms[spawn.pos.roomName];
        if (!spawn.spawning) {
            var totalHarvesters = countCreeps('harvester', spawn.pos.roomName);
            if (spawn.energy >= 200) {
                if (totalHarvesters === 0) {
                    var totalOfParts = 1;
                }
                else {
                    var totalOfParts =  Math.round((spawn.room.energyCapacityAvailable / 200)-1);
                }
                if (creeptype === 'harvester') {
                    var maxOfWorkParts = 8;
                    var maxOfCarryParts = 3;
                    var maxOfMoveParts = 3;
                    var body = [];
                    var i = 0;
                    while (i < totalOfParts) {
                        if (i < maxOfWorkParts) {
                            body.push(WORK);
                        }
                        if (i < maxOfCarryParts) {
                            body.push(CARRY);
                        }
                        if (i < maxOfMoveParts) {
                            body.push(MOVE);
                        }
                    i++;
                    }
                }
                else if (creeptype === 'upgrader') {
                    var totalTransporters = countCreeps('transporter', spawn.pos.roomName);
                    if (totalTransporters <= 1) {
                        var totalOfParts = 1;
                    }
                    else {
                      var totalOfParts =  Math.round((spawn.room.energyCapacityAvailable / 200)-1);
                    }
                    var maxOfWorkParts = 7;
                    var maxOfCarryParts = 3;
                    var maxOfMoveParts = 3;
                    var body = [];
                    var i = 0;
                    while (i < totalOfParts) {
                        if (i < maxOfWorkParts) {
                            body.push(WORK);
                        }
                        if (i < maxOfCarryParts) {
                            body.push(CARRY);
                        }
                        if (i < maxOfMoveParts) {
                            body.push(MOVE);
                        }
                    i++;
                    }
                }
                else if (creeptype === 'transporter') {
                    var totalTransporters = countCreeps('transporter', spawn.pos.roomName);
                    if (totalTransporters === 0) {
                        var totalOfParts = 1;
                    }
                    else {
                      var totalOfParts =  Math.round((spawn.room.energyCapacityAvailable / 100)-1);
                    }
                    var maxOfCarryParts = 25;
                    var maxOfMoveParts = 25;
                    var body = [];
                    var i = 0;
                    while (i < totalOfParts) {
                        if (i < maxOfCarryParts) {
                            body.push(CARRY);
                        }
                        if (i < maxOfMoveParts) {
                            body.push(MOVE);
                        }
                    i++;
                    }
                }
                else if (creeptype === 'engineer') {
                  var totalOfParts =  Math.round((spawn.room.energyCapacityAvailable / 200)-1);
                    var maxOfWorkParts = totalOfParts;
                    var maxOfCarryParts = totalOfParts;
                    var maxOfMoveParts = 4;
                    var body = [];
                    var i = 0;
                    while (i < totalOfParts) {
                        if (i < maxOfWorkParts) {
                            body.push(WORK);
                        }
                        if (i < maxOfCarryParts) {
                            body.push(CARRY);
                        }
                        if (i < maxOfMoveParts) {
                            body.push(MOVE);
                        }
                    i++;
                    }
                }
                else if (creeptype === 'miner') {
                  var totalOfParts =  Math.round((spawn.room.energyCapacityAvailable / 200)-1);
                    var maxOfWorkParts = totalOfParts;
                    var maxOfCarryParts = 2;
                    var maxOfMoveParts = 2;
                    var body = [];
                    var i = 0;
                    while (i < totalOfParts) {
                        if (i < maxOfWorkParts) {
                            body.push(WORK);
                        }
                        if (i < maxOfCarryParts) {
                            body.push(CARRY);
                        }
                        if (i < maxOfMoveParts) {
                            body.push(MOVE);
                        }
                    i++;
                    }
                }
                else if (creeptype === 'guard') {
                  var totalOfParts =  Math.round((spawn.room.energyCapacityAvailable / 140)-1);
                    var maxOfToughParts = totalOfParts;
                    var maxOfMoveParts = 4;
                    var maxOfAttackParts = totalOfParts;
                    var body = [];
                    var i = 0;
                    while (i < totalOfParts) {
                        if (i < maxOfToughParts) {
                            body.push(TOUGH);
                        }
                        if (i < maxOfMoveParts) {
                            body.push(MOVE);
                        }
                        if (i < maxOfAttackParts) {
                            body.push(ATTACK);
                        }
                    i++;
                    }
                }
                else if (creeptype === 'healer') {
                  var totalOfParts =  Math.round((spawn.room.energyCapacityAvailable / 310)-1);
                    var maxOfToughParts = 2;
                    var maxOfMoveParts = 4;
                    var maxOfHealParts = totalOfParts;
                    var body = [];
                    var i = 0;
                    while (i < totalOfParts) {
                        if (i < maxOfToughParts) {
                            body.push(TOUGH);
                        }
                        if (i < maxOfMoveParts) {
                            body.push(MOVE);
                        }
                        if (i < maxOfHealParts) {
                            body.push(HEAL);
                        }
                    i++;
                    }
                }
                else if (creeptype === 'claimer') {
                    var totalOfParts = Math.round((spawn.room.energyCapacityAvailable / 150)-6);
                    var maxOfAttackParts = totalOfParts;
                    var maxOfMoveParts = totalOfParts;
                    var maxOfClaimParts = 1;
                    var body = [];
                    var i = 0;
                    while (i < totalOfParts) {
                        if (i < maxOfMoveParts) {
                            body.push(MOVE);
                        }
                        if (i < maxOfAttackParts) {
                            body.push(ATTACK);
                        }
                        if (i < maxOfClaimParts) {
                            body.push(CLAIM);
                        }
                    i++;
                    }
                }
            }
            else {
                if (totalHarvesters === 0) {
                    var totalOfParts = 1;
                    if (creeptype === 'harvester') {
                        var maxOfWorkParts = 8;
                        var maxOfCarryParts = 3;
                        var maxOfMoveParts = 3;
                        var body = [];
                        var i = 0;
                        while (i < totalOfParts) {
                            if (i < maxOfWorkParts) {
                                body.push(WORK);
                            }
                            if (i < maxOfCarryParts) {
                                body.push(CARRY);
                            }
                            if (i < maxOfMoveParts) {
                                body.push(MOVE);
                            }
                        i++;
                        }
                    }

                }
            }
            
            var canIspawn = spawn.canCreateCreep(body, null, { type: creeptype, action: 'undefined', homeroom: spawn.pos.roomName, homespawn: spawn.name, goto: creepgoto, id: Game.time });
            console.log(canIspawn);
            if (canIspawn === 0) {
                var name = spawn.createCreep(body, null, { type: creeptype, action: 'undefined', homeroom: spawn.pos.roomName, homespawn: spawn.name, goto: creepgoto, id: Game.time });
                if (_.isString(name)) {
                    result = ('Spawning new ' + creeptype + ' on ' + spawn.name + ' with name ' + name + '.');
                    console.log(result);
                }
            }
        }
    };
